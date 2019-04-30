module.exports = (app) => {
  
  require('./users')(app)
  
  require('./playground/random')(app)
  require('./playground/form')(app)
}