
import usersService from './users';

import searchExample from './playground/search.example';
import formExample from './playground/form.example';
import chatExample from './playground/chat.example';

export default (app) => {
  app.use('todos', {
    async get(name) {
      return app.MESSAGE('log', {
        data: 'Server sent data',
      });
    },
  });


  usersService(app);

  searchExample(app);
  formExample(app);
  chatExample(app);
  
};
