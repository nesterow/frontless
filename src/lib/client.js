import feathers from '@feathersjs/client';
import axios from 'axios';
import evbus from './evbus';
import io from 'socket.io-client';
import socketio from '@feathersjs/socketio-client';

const hooks = {
  after: {
    all: [(context) => {
      const {opts} = context.result;
      if (typeof opts === 'object' &&
          opts._t === '/m/') {
        evbus.trigger('update:' + opts._id, context.result.data);
      }
      return Promise.resolve(context);
    }],
  },
};


const ws = io('http://localhost:5050/');
const rest = feathers.rest('http://localhost:5050');

const app = feathers();
const wsc = feathers();


app.configure(rest.axios(axios));
wsc.configure(socketio(ws, {
  timeout: 2000,
}));

wsc.hooks(hooks);
app.hooks(hooks);
app.io = wsc;
app.ws = ws;

export default app;
