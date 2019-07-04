//** RiotJS plugins that supposed to work the same way on client and server */
import client from 'client'
import {extend} from 'lodash'
import {COOKIE_NAME} from 'config/browser'
import {withRouter} from '@frontless/core/browser'
import Store from 'components/store'

const isBrowser = typeof window !== 'undefined'
const riot = isBrowser ? require('riot') : require('@frontless/riot')


// First register components
if (!isBrowser) {
  const glob = require('glob')
  const path = require('path')
  const register = (file) => {
    const tag = require(path.resolve(file))
    const component = tag.default;
    riot.register(component.name, component)
  };
  const test = (file) => {
    return !file.startsWith('./specs/') && !file.startsWith('./node_modules/')
  }
  glob.sync( './**/*.riot' ).forEach( ( file ) => test(file) && register(file))
}

const Global = (instance) => {

  instance.setGlobal = function(data) {
    if (!isBrowser) {
      const globals = JSON.parse(this.req.session.globals || '{}');
      this.req.session.globals = JSON.stringify(extend(globals, data))
    }
  }.bind(instance)

  Object.defineProperty(instance, 'globals', {
    get: function() {
      if (isBrowser) {
        const el = document.getElementById('globals')
        const data = el ? el.innerText : '{}'
        return JSON.parse(data || '{}')
      } else {
        return JSON.parse(this.req.session.globals || '{}')
      }
    }.bind(instance)
  })

}

const ClientPlugin = (instance) => {
  Object.defineProperty(instance, 'client', {
    get: function() {
      return client.factory(this.req)
    }.bind(instance)
  })
  instance.service = function(name) {
    return this.client.service(name)
  }.bind(instance);
};

const AuthPlugin = (instance) => {

  const fetch = instance.fetch || (() => Promise.resolve());
  instance.fetch = function(props) {
    if (!isBrowser) {
      const {authenticated, user} = props.req.session;
      const {loggedIn, group} = (instance.access || {});
      if (loggedIn) {
        if (!authenticated) {
          return this.redirect('/login')
        }
        if (group && group !== user.group) {
          return this.redirect('/login')
        }
      }
      this.setGlobal({
        authenticated: authenticated,
        userId: user.userId,
        username: user.username
      })
    }
    return Promise.resolve(fetch.bind(instance)(props))
  }.bind(instance)


  instance.logout = function() {
    if (isBrowser) {
      const { CookieStorage } = require('cookie-storage')
      new CookieStorage().removeItem(COOKIE_NAME)
      this.redirect('/login')
    }
  }.bind(instance)

}

if (isBrowser) {
  document.__GLOBAL = {}
}

riot.install(withRouter)
riot.install(Global)
riot.install(Store)
riot.install(ClientPlugin)
riot.install(AuthPlugin)