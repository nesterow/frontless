const feathers = require('@feathersjs/client')
const axios = require('axios')
const io = require('socket.io-client')
const socketio = require('@feathersjs/socketio-client')
const auth = require('@feathersjs/authentication-client')
const isClient = typeof window !== 'undefined'

function factory(request) {

  const authOptions = {
    cookie: 'frontless.jwt',
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
          ctx.params.accessToken = request.cookies['frontless.jwt']
        }]
      }
    }
  }
  
  const endpoint = isClient ? location.origin : process.env.ORIGIN
  
  
  const ws = io(endpoint)
  const rest = feathers.rest(endpoint)
  
  const app = feathers()
  const wsc = feathers()
  
  
  app.configure(rest.axios(axios));
  wsc.configure(socketio(ws, {
    timeout: 2000,
  }))
  
  app.configure(auth(authOptions))
  wsc.configure(auth(authOptions))
  
  wsc.hooks(hooks)
  app.hooks(hooks)
  app.io = wsc
  app.ws = ws
  
  return app

}

module.exports = factory()
module.exports.factory = factory