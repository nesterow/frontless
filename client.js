const EventBus = require('eventbusjs')
const feathers = require('@feathersjs/client')
const axios = require('axios')
const io = require('socket.io-client')
const socketio = require('@feathersjs/socketio-client')

const hooks = {
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

const endpoint = typeof window !== 'undefined' ? location.origin : process.env.ORIGIN


const ws = io(endpoint)
const rest = feathers.rest(endpoint)

const app = feathers()
const wsc = feathers()


app.configure(rest.axios(axios));
wsc.configure(socketio(ws, {
  timeout: 2000,
}))

wsc.hooks(hooks)
app.hooks(hooks)
app.io = wsc
app.ws = ws

module.exports = app