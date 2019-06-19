const {COOKIE_NAME, WEBSOCKETS} = require('config/browser')
const feathers = require('@feathersjs/client')
const axios = require('axios')
const io = require('socket.io-client')
const socketio = require('@feathersjs/socketio-client')
const auth = require('@feathersjs/authentication-client')
const { CookieStorage } = require('cookie-storage');
const isClient = typeof window !== 'undefined'


function factory(request) {

  const authOptions = {
    cookie: COOKIE_NAME,
    storage: new CookieStorage()
  }
  
  let hooks = {}
  if (isClient) {
    const EventBus = require('eventbusjs')
    hooks = {
      after: {
        all: [(context) => {
          const {opts} = context.result
    
          if (typeof opts === 'object' &&
              opts._t === '/m/') {
            const eventName = opts._id + ':update';
            EventBus.dispatch(eventName, context, context.result.data)
          }
    
          return Promise.resolve(context)
        }],
      },
    };
  }

  if (request) {
    hooks = {
      before: {
        all: [(ctx) => {
          ctx.params.accessToken = request.cookies [COOKIE_NAME]
        }]
      }
    }
  }
  
  const endpoint = (isClient ? location.origin : process.env.ORIGIN) || 'http://localhost:6767'
  
  
  const rest = feathers.rest(endpoint)
  const app = feathers()

  app.configure(rest.axios(axios))
  app.configure(auth(authOptions))
  app.hooks(hooks)


  if (isClient && WEBSOCKETS) {
    const wsc = feathers()
    const ws = io(endpoint)
    wsc.configure(auth(authOptions))
    wsc.configure(socketio(ws, {
      timeout: 2000,
    }))
    wsc.hooks(hooks)
    app.io = wsc
    app.ws = ws
  }
  
  return app

}

module.exports = factory()
module.exports.factory = factory