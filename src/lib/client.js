import feathers from '@feathersjs/client';
import axios from 'axios';
import evbus from './evbus';

const app = feathers();
const rest = feathers.rest('http://localhost:5050');
app.configure(rest.axios(axios));
app.hooks({
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
});

export default app;
