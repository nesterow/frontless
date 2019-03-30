
export default (app) => {
  const {MESSAGE} = app;
  app.use('playground/form-example', {
    async get(name) {
      return MESSAGE('form-example', {
        errors: {},
      });
    },
    async create(ctx) {
      return MESSAGE('form-example', {
        errors: {},
      });
    },
  });
};
