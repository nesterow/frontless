import feathers from '@feathersjs/client'
import axios from 'axios'
import evbus from 'lib/evbus'
import io from 'socket.io-client/dist/socket.io'
import socketio from '@feathersjs/socketio-client'

const hooks = {
  before: {
    all: [(context) => {
      if (typeof window !== 'undefined') {
        const {name} = context.service;
        evbus.emit('request:start', context)
        evbus.emit(name+':start', context)
      }
      return Promise.resolve(context)
    }],
  },
  after: {
    all: [(context) => {
      if (typeof window !== 'undefined') {
        const {opts} = context.result
        if (typeof opts === 'object' &&
            opts._t === '/m/') {
          evbus.emit('update:' + opts._id, context.result.data)
        }
        const {name} = context.service;
        evbus.emit('request:end',context)
        evbus.emit(name+':end', context)
        return Promise.resolve(context)
      }
      return Promise.resolve(context)
    }],
  },
  error: (context) => {
    if (typeof window !== 'undefined') {
      const {name} = context.service;
      evbus.emit('request:error', context)
      evbus.emit(name+':error', context)
    }
  }
};

const endpoint = 'http://localhost:8000';

const app = feathers()
if (typeof window !== 'undefined') {
  const ws = io(endpoint)
  const wsc = feathers()
  wsc.configure(socketio(ws, {
    timeout: 2000,
  }));
  wsc.hooks(hooks)
  app.io = wsc
  app.ws = ws
  
}

const rest = feathers.rest(endpoint)

app.configure(rest.axios(axios))
app.hooks(hooks)


export default app