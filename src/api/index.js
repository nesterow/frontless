export default (app) => {
  app.use('todos', {
    async get(name) {
      return app.MESSAGE('log', {
        data: 'Server sent data',
      });
    }
  });
};
