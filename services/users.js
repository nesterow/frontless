const local = require('@feathersjs/authentication-local')

module.exports = (app) => {
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
