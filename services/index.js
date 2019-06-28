
import users from './users'

export default function (app, mongo) {

  users(app, mongo)

  //Playground services
  require('./playground/random')(app)
  require('./playground/caesar')(app)
  require('./playground/form')(app)
  require('./playground/chat')(app)
  require('./playground/todos')(app, mongo)
  
}