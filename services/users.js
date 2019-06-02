const local = require('@feathersjs/authentication-local')
const auth = require('@feathersjs/authentication')
const validate = require('validate.js')
const {MONGO_DATABASE} = process.env

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


  password: {
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


module.exports = (app, mongo) => {
  
  const Model =  mongo.db(MONGO_DATABASE).collection('users')

  app.use('users', {

    async find() {
      return []
    },
    
    // check if user exists
    async get(username) {
      const user = await Model.findOne({username,})
      return {
        exists: !!user
      }
    },

    async create(form) {

      const errors = validate(form, formModel)
      if (errors) {
        return app.setState('signup-form', {
          errors,
        })
      }
      
      const {exists} = await this.get(form.username)
      if (!exists) {
        return Model.insert(form)
      } else {
        return app.setState('signup-form', {
          errors: {
            username: ["User already exists"]
          }
        });
      }
    },

    async update() {
      return []
    },

    async remove() {
      return []
    },

  })

  app.service('users').hooks({
    before: {
      create: [
        local.hooks.hashPassword(),
      ]
    },
    after: local.hooks.protect('password')
  })

  app.service('authentication').hooks({
    before: {
     create: [
      // You can chain multiple strategies
      auth.hooks.authenticate(['local']),
     ],
     remove: [
      auth.hooks.authenticate('jwt')
     ]
    }
   });

}
