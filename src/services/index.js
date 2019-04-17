
import usersService from './users';

import searchExample from './playground/search.example';
import formExample from './playground/form.example';
import chatExample from './playground/chat.example';

import { MESSAGE } from 'lib/frontless';

export default (app) => {

  app.use('ping', {
    async get(name) {
      return MESSAGE('homePage', {
        data: name + ' : ' + new Date().toISOString(),
      });
    },
  });

  app.use('random', {
    async get(name) {
      return MESSAGE('randomNumber', {
        number: Math.round(Math.random() * 10000),
      });
    },
  });


  usersService(app);

  searchExample(app);
  formExample(app);
  chatExample(app);
};
