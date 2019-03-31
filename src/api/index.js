
import searchExample from './playground/search.example';
import formExample from './playground/form.example';

export default (app) => {
  app.use('todos', {
    async get(name) {
      return app.MESSAGE('log', {
        data: 'Server sent data',
      });
    },
  });
  searchExample(app);
  formExample(app);
};
