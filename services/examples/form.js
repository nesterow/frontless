// const validator = require('validator')
const validate = require('validate.js')

const formModel = {
  
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
    equality: {
      attribute: "password1",
      message: "Passwords do not match",
    },
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
      message: '^Before signing up you have to agree with our terms an conditions',
    },
  },

}


module.exports = (app) => {
  app.use('form-validation', {

    async create(data) {
      const errors = validate(data, formModel)
      if (errors) {
        return app.setState('form-validation', {
          errors,
          success: false,
        })
      }

      return app.setState('form-validation', {
        errors: {},
        success: true,
      })
    
    },


  })
}