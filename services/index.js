module.exports = function (app, db) {
  
  require('./users')(app, db)

  //Playground services
  require('./playground/random')(app)
  require('./playground/caesar')(app)
  require('./playground/form')(app)
  require('./playground/chat')(app)
}