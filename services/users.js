module.exports = (app) => {
  app.use('users', {

    async find() {
      return []
    },

    async get() {
      return {}
    },

    async create() {
      return {}
    },

    async update() {
      return []
    },

    async delete() {
      return []
    },

  })
}
