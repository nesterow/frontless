const local = require('@feathersjs/authentication-local')
const {MONGO_DATABASE} = process.env

module.exports = (app, mongo) => {
  
  const Model =  mongo.db(MONGO_DATABASE).collection('users')

  app.use('users', {

    async find() {
      return []
    },

    async get() {
      return {}
    },

    async create(ctx) {
      return {}
    },

    async update() {
      return []
    },

    async delete() {
      return []
    },

  })

  app.service('users').hooks({
    before: {
      create: [
        local.hooks.hashPassword()
      ]
    },
    after: local.hooks.protect('password')
  })

}
