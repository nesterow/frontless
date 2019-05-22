const service = require('feathers-mongodb');

module.exports = (app, mongo) => {
  
  const Model =  mongo.db('test').collection('todos')

  async function cleanAndMock(){
    const count = await Model.countDocuments ({})
    if (count > 200 || count == 0) {
      await Model.remove({})
      await Model.insertMany([
        {text: "Wake up!", time: 0, status: 'active'},
        {text: "Do your morning routine", time: 0, status: 'active'},
        {text: "Get a coffee", time: 0, status: 'active'},
        {text: "Build a robot", time: 0, status: 'active'},
        {text: "Make a robot build a robot", time: 0, status: 'active'},
        {text: "Create an army of robots", time: 0, status: 'active'},
        {text: "Overthrow all world leaders", time: 0, status: 'active'},
        {text: "Become ruler of the Universe", time: 0, status: 'active'},
        {text: "wake up already!", time: 0, status: 'active'},
      ])
    }
  };

  app.use('/todos', service({
    Model,
    paginate: {
      default: 5,
      max: 10
    }
  }))

  app.use('todo/count', {
    async find() {
      await cleanAndMock()
      const all = await Model.countDocuments ({})
      const active = await Model.countDocuments ({ status: 'active' })
      const done = await Model.countDocuments ({ status: 'done' })
      return {
        all,
        active,
        done,
      }
    }
  });



}