import validate from 'validate.js';

const formValidationModel = {
  username: {
    presence: {
      message: '^Login is required',
    },
    length: {
      maximum: 12,
      minimum: 4,
      message: '^Username must be from 6 to 12 symbols',
    },
  },
  email: {
    email: {
      message: '^Must be an email',
    },
  },
  password1: {
    presence: {
      message: '^Password is required',
    },
    length: {
      minimum: 6,
      message: '^Minimum 6 symbols',
    },
  },
  password2: {
    equality: 'password1',
    presence: {
      message: '^Password is required',
    },
    length: {
      minimum: 6,
      message: '^Minimum 6 symbols',
    },
  },
  agree: {
    presence: {
      // eslint-disable-next-line max-len
      message: '^Before signing up you have to agree with our community terms an conditions',
    },
  },
};
validate.validators.equality.message = '^Passwords do not match';

export default (app) => {
  const {MESSAGE} = app;
  app.use('playground/form-example', {

    // check login availability
    async get(name) {
      return MESSAGE('form-example', {
        errors: {},
      });
    },

    // register user
    async create(data) {
      const errors = validate(data, formValidationModel);

      if (errors) {
        return MESSAGE('form-example', {
          errors,
        });
      } else {
        return MESSAGE('form-example', {
          errors: {},
          success: true,
        });
      }
    },

  });
};
