const dotenv = require('dotenv');
dotenv.config({path: process.argv[process.argv.length - 1]});

const riot = require('riot')
const fs = require('fs')
const ejs = require('ejs')
const express = require('@feathersjs/express')
const feathers = require('@feathersjs/feathers')
const session = require('express-session')
const cors = require('cors')
const socketio = require('@feathersjs/socketio')
const authentication = require('@feathersjs/authentication')
const local = require('@feathersjs/authentication-local')
const register = require('@riotjs/ssr/register')
register();
const {renderAsync} = require('frontless-utils')




const sessionMiddleware = session({
  secret: process.env.HTTP_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: process.env.HTTP_SESSION_SECURE === 'yes'},
});

const corsMiddleware = cors({
  origin: '*',
});


const api = feathers()
const app = express(api)

app.use(corsMiddleware)
app.use(sessionMiddleware)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.configure(express.rest())
app.use('/assets', express.static('assets'))

app.configure(socketio({}, function(io) {
  // io.use(function(socket, next) {
  //   corsMiddleware(socket.request, socket.request.res, next);
  // });
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
}));
app.configure(local());


function resolvePath(path) {
  const fullPath = ('pages/' + path )
    .replace(/\/\//g, '/').replace(/\/$/, '')
  try {
    
    try {
      if (fs.statSync(fullPath + '.riot').isFile())
        return fullPath + '.riot';
    }
    catch (e) { }

    if (fs.statSync(fullPath + '/index.riot').isFile())
      return fullPath + '/index.riot';

  } catch (e) {
    return false;
  }

}

app.use('/*', async (req, res) => {

  req._res = res;
  if (req.headers.accept &&
      req.headers.accept.includes('/json')) {
    return next();
  }

  try {
    const path = resolvePath(req.params [0])
    const component = require('./' + (path || 'pages/errors/404.riot')).default
    const {output, state} = await renderAsync('section', component, { req, });

    ejs.renderFile('./pages/layout/base.ejs', {req, output, state}, null, function(err, data) {
      if (err) {
        return res.status(500).end(err)
      }
      res.status(path ? 200 : 404).end(data)
    })
  } catch(e) {

    const component = require('./' + ('pages/errors/400.riot')).default
    
    const {output, state} = await render('section', component, { req, stack: (e.message.stack || e.message) });
    ejs.renderFile('./pages/layout/base.ejs', {req, output, state}, null, function(err, data) {
      if (err) {
        return res.status(500).end(err)
      }
      res.status(400).end(data)
    })
  }
  
  

})


app.message = (id, data) => {
  return {
    opts: {
      _t: '/m/',
      _id: id,
    },
    data,
  }
}

require('./services')(app)

app.listen(6767, () => {
  console.log(`👍🏻 app is listening on ${6767}`)
})