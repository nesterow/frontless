//** RiotJS plugins that supposed to work the same way on client and server */
const riot = require('riot')
const client = require('client')
const {extend} = require('lodash')
const {withRouter} = require('components/utils')
const isBrowser = typeof window !== 'undefined'


// First register components
if (!isBrowser) {
  const glob = require('glob')
  const path = require('path')
  const register = (file) => {
    const tag = require(path.resolve(file))
    const component = tag.default;
    riot.register(component.name, component)
  };
  glob.sync( './**/*.riot' ).forEach( ( file ) => register(file))
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
      new CookieStorage().removeItem('feathers-jwt')
      this.redirect('/login')
    }
  }.bind(instance)

}


riot.install(withRouter)
riot.install(Global)
riot.install(ClientPlugin)
riot.install(AuthPlugin)