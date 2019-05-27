const local = require('@feathersjs/authentication-local')
const errors = require('@feathersjs/errors')
const {MONGO_DATABASE} = process.env

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
      const {exists} = await this.get(form.username)
      if (!exists) {
        return new errors.Conflict('user already exists')
      } else {
        return new Error('user already exists')
      }
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
        local.hooks.hashPassword(),
      ]
    },
    after: local.hooks.protect('password')
  })

}
