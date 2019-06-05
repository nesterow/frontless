/*
███████╗██████╗  ██████╗ ███╗   ██╗████████╗██╗     ███████╗███████╗███████╗
██╔════╝██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██║     ██╔════╝██╔════╝██╔════╝
█████╗  ██████╔╝██║   ██║██╔██╗ ██║   ██║   ██║     █████╗  ███████╗███████╗
██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║   ██║   ██║     ██╔══╝  ╚════██║╚════██║
██║     ██║  ██║╚██████╔╝██║ ╚████║   ██║   ███████╗███████╗███████║███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝
<<<<<<<<<<<<   FeathersJS - RiotJS - Turbolinks - Express    >>>>>>>>>>>>>>> 
----------------------------------------------------------------------------
@GitHub: https://github.com/nesterow/frontless
@License: MIT
@Author: Anton Nesterov <arch.nesterov@gmail.com>
*/

const dotenv = require('dotenv');
dotenv.config({path: process.argv[process.argv.length - 1]});

const cookieParser = require('cookie-parser')
const express = require('@feathersjs/express')
const feathers = require('@feathersjs/feathers')
const session = require('express-session')
const cors = require('cors')
const socketio = require('@feathersjs/socketio')
const authentication = require('@feathersjs/authentication')
const local = require('@feathersjs/authentication-local')
const Verifier = require('components/verifier')
const register = require('@riotjs/ssr/register')
register()

const {CACHE_PAGES} = require('./components/webworker/config')
global.CACHE_PAGES = CACHE_PAGES
require('./plugins')

const FrontlessMiddleware = require('components/utils/middleware')
const {install, withPlugins} = require('components/utils/plugins')

// install frontless plugins
// const pluginExample = require('components/nesterow/frontless-plugin')
// install(pluginExample)


const sessionMiddleware = session({
  secret: process.env.HTTP_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: process.env.HTTP_SESSION_SECURE === 'yes'},
});

// Use CORS
// you can use dynamic resolution if allowed hosts are kept in some storage
const ALOWED_HOSTS = ['*']
const origin = async (host, cb) => {
  if (ALOWED_HOSTS.includes('*') || ALOWED_HOSTS.includes(host))
    return cb(null, true);
  return cb('Host is not alowed', false);
}

const corsMiddleware = cors({
  origin,
});


const api = feathers()
const app = express(api)
withPlugins(app, __dirname)

app.emit('setup', app)

app.use(cookieParser())
app.use(corsMiddleware)
app.use(sessionMiddleware)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.configure(express.rest())
app.use('/assets', express.static('assets'))
app.use('/worker.js', express.static('assets/worker.js'))
app.use('/boot.js', express.static('assets/boot.js'))

app.use((req, res, next) => {
  const token = req.cookies ['feathers-jwt']
  app.passport.verifyJWT(token, {
    secret: process.env.REST_AUTH_SECRET,
  }).

  then((user) => {
    req.session.authenticated = true
    req.session.user = user
    req.session.save()
    next()
  }).

  catch((err)=> {
    req.session.authenticated = false
    req.session.user = { userId: null }
    req.session.save()
    next()
  })
  
})

app.configure(socketio({}, function(io) {
  io.origins(origin)
  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next)
  });
  io.use(function(socket, next) {
    socket.feathers.request = socket.request
    next();
  });
}));
app.configure(authentication({
  session: true,
  secret: process.env.REST_AUTH_SECRET,
  service: process.env.REST_AUTH_SERVICE,
  cookie: {
    enabled: true,
    name: 'feathers-jwt',
    httpOnly: false,
    secure: false
  },
  jwt: {
    header: { typ: 'access' },
    audience: process.env.ORIGIN,
    subject: 'authentication',
    issuer: 'frontless',
    algorithm: 'HS256',
    expiresIn: '10d' // the access token expiry
   },
}));
app.configure(local({
  session: true,
  usernameField: 'username',
  passwordField: 'password',
  entityUsernameField: 'username', 
  entityPasswordField: 'password',
  Verifier,
}))

app.emit('setup:ssr', app)
app.use('/*@:args',  FrontlessMiddleware(__dirname, ['styles']))
app.use('/*',  FrontlessMiddleware(__dirname, ['styles']))

app.setState = (id, data) => {
  return {
    opts: {
      _t: '/m/',
      _id: id,
    },
    data,
  }
}


const start = (mongo) => {
  app.emit('connected', app, mongo)
  require('./services')(app, mongo)
  app.mongo = mongo;
  app.listen(6767, () => {
    console.log(`👍  app is listening on ${6767} \r\n`)
  })
}

if (process.env.MONGODB_URI) {
  const MongoClient = require('mongodb').MongoClient
  MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then((mongo) => {
      console.error(`✔️ MongoDB connection is active`)
      start(mongo)
    })
    .catch(() => {
      console.error(`❌  MongoDB connection error`)
      console.log('↪️ Trying to continue without MongoDB')
      start(null)
    })
} else {
  start()
}

