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


import serverConfig from 'config/server'
import browserConfig from 'config/browser'

const {corsResolver} = serverConfig

const {
  CACHE_PAGES,
  COOKIE_NAME, 
  IS_PWA
} = browserConfig;
global.CACHE_PAGES = CACHE_PAGES
global.IS_PWA = IS_PWA

const {
  HTTP_SESSION_SECRET, 
  HTTP_SESSION_SECURE,
  REST_AUTH_SECRET,
  REST_AUTH_SERVICE,
  ORIGIN,
  MONGODB_URI
} = process.env;

const xss = require("xss")
const xssOptions = {}
global.XSS = new xss.FilterXSS(xssOptions)


import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import express from '@feathersjs/express'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio'
import authentication from '@feathersjs/authentication'
import local from '@feathersjs/authentication-local'
import Verifier from 'components/verifier'


import 'plugins'
import {Frontless} from '@frontless/core/server'
import {MongoClient} from 'mongodb'
import services from 'services'


const sessionMiddleware = session({
  secret: HTTP_SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: HTTP_SESSION_SECURE === 'yes'},
});

const corsMiddleware = cors({
  origin: corsResolver,
});

const api = feathers()
const app = express(api)

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
  const token = req.cookies [COOKIE_NAME]
  app.passport.verifyJWT(token, {
    secret: REST_AUTH_SECRET || 'secret',
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

  io.origins(corsResolver)
  
  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next)
  })
  
  io.use(function(socket, next) {
    socket.feathers.request = socket.request
    next()
  })

}))

app.configure(authentication({
  session: true,
  secret: REST_AUTH_SECRET || 'secret',
  service: REST_AUTH_SERVICE || 'users',
  cookie: {
    enabled: true,
    name: COOKIE_NAME,
    httpOnly: false,
    secure: false
  },
  jwt: {
    header: { typ: 'access' },
    audience: ORIGIN,
    subject: 'authentication',
    issuer: 'frontless',
    algorithm: 'HS256',
    expiresIn: '10d' // the access token expiry
   },
}))

app.configure(local({
  session: true,
  usernameField: 'username',
  passwordField: 'password',
  entityUsernameField: 'username', 
  entityPasswordField: 'password',
  Verifier,
}))

const dir = __dirname + '/..'
app.emit('setup:ssr', app)
app.use('/*@:args',  Frontless(dir, ['styles']))
app.use('/*',  Frontless(dir, ['styles']))

app.use((err, req, res, next) => {
  const {type, code} = err;
  if (type === 'FeathersError') {
    res.status(code).json(err.toJSON())
  }
})

app.setState = (id, data) => {
  return {
    opts: {
      _t: '/m/',
      _id: id,
    },
    data,
  }
}


let Resolve = () => 0
let Reject = () => 0 
const ReadyPromise = new Promise((resolve, reject) => {
  Resolve = resolve;
  Reject = reject;
})  

const start = (mongo) => {
  const {PORT = 6767} = process.env;
  app.emit('connected', app, mongo)
  services(app, mongo)
  app.mongo = mongo;
  
  app.listen(PORT, (err) => {
    console.log(`👍  app is listening on http://localhost:${PORT} \r\n`)
    Resolve({app, mongo})
  }).
  
  on('error', (error) => {
    console.log(`❌ ${error} \r\n`)
    Reject(error)
  })

}

if (MONGODB_URI) 
{

  MongoClient.connect(MONGODB_URI, { useNewUrlParser: true })
    .then((mongo) => {
      console.error(`✔️ MongoDB connection is active`)
      start(mongo)
    })
    .catch(() => {
      console.error(`❌  MongoDB connection error`)
      console.log('↪️ Trying to continue without MongoDB')
      start(null)
    })
} 

else 
{
  start()
}

export default ReadyPromise