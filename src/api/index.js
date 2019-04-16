
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


  usersService(app);

  searchExample(app);
  formExample(app);
  chatExample(app);
};
