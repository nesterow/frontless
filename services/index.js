
import users from './users'

export default function (app, mongo) {

  users(app, mongo)

  //Playground services
  require('./examples/random')(app)
  require('./examples/form')(app)
  require('./examples/chat')(app)
  require('./examples/todos')(app, mongo)
  
}