const service = require('feathers-mongodb');

module.exports = (app, mongo) => {
  
  const Model =  mongo.db('test').collection('todos')

  app.use('/todos', service({
    Model,
    paginate: {
      default: 5,
      max: 10
    }
  }))

  app.use('todo/count', {
    async find(ctx) {
      const {identity} = ctx.query;
      const all = await Model.countDocuments ({identity,})
      const active = await Model.countDocuments ({ status: 'active', identity })
      const done = await Model.countDocuments ({ status: 'done', identity })
      return {
        all,
        active,
        done,
      }
    }
  });



}