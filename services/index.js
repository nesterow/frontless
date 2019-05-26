module.exports = function (app, mongo) {

  require('./users')(app, mongo)

  //Playground services
  require('./playground/random')(app)
  require('./playground/caesar')(app)
  require('./playground/form')(app)
  require('./playground/chat')(app)
  require('./playground/todos')(app, mongo)
  
}