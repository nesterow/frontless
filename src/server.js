import { Server } from 'http'

import dotenv from 'dotenv'
dotenv.config({path: process.argv[process.argv.length - 1]})

import ssr from 'react-ssr'
import helmet from 'helmet';
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'
import authentication from '@feathersjs/authentication'
import local from '@feathersjs/authentication-local'
import session from 'express-session'
import cors from 'cors'


import services from './api';
import routes from './routes'
import Html from './pages/Layout.jsx'

const api = feathers()
const app = express(api)

const router = express.Router()
const renderer = ssr({ 
  debug: true,
  routes,
  Html
})

const sessionMiddleware = session({
  secret: process.env.HTTP_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: process.env.HTTP_SESSION_SECURE === 'yes'},
})

const corsMiddleware = cors({
  origin: '*',
})

app.use(helmet());

app.configure(socketio(function(io) {
  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
  })
  io.use(function(socket, next) {
    socket.feathers.request = socket.request;
    next();
  })
}))


app.use('/assets', express.static('assets'))
app.use(corsMiddleware)
app.use(sessionMiddleware)
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.configure(express.rest())

app.configure(authentication({
  session: true,
  secret: process.env.REST_AUTH_SECRET,
  service: process.env.REST_AUTH_SERVICE,
}))

app.configure(local())

app.use(function (req, res, next) {
 
  if ('EIO' in req.query)
    return next();
  if (req.headers.accept &&
      req.headers.accept.includes('/json')) {
    return next();
  }
  if (req.feathers &&
    req.feathers.headers.accept.includes('/json')) {
  return next();
}
  renderer(req, res, next);
})

services(app);

const server = new Server(app)
app.setup(server);
server.listen(8000, err => {
  if (err) {
    return console.error(`👎  ${err}`)
  }

  console.info(`👍  Server launched at: localhost:8000`)
})
