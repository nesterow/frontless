
import FrontLess from '../frontless';
import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import session from 'express-session';
import cors from 'cors';
import socketio from '@feathersjs/socketio';
import authentication from '@feathersjs/authentication';
import local from '@feathersjs/authentication-local';
import {renderPage, resolvePageName} from './render';

const api = feathers();
const app = express(api);

api.MESSAGE = FrontLess.MESSAGE;
app.MESSAGE = FrontLess.MESSAGE;
app.PARSE = FrontLess.PARSE;
api.PARSE = FrontLess.PARSE;
app.UPDATE = FrontLess.UPDATE;
api.UPDATE = FrontLess.UPDATE;

const sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false},
})

app.use(cors());
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.configure(express.rest());
app.configure(socketio({}, function(io) {
  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
  });
  io.use(function(socket, next) {
    socket.feathers.request = socket.request;
    next();
  });
}));
app.configure(authentication({
  session: true,
  secret: '123sd234sdfsdf',
  service: 'users',
}));
app.configure(local());


/**
 * FrontLess express middleware.
 * Provides methods for parsing frontless HTTP requests and valid responces
 * @param {Object} req - express request
 * @param {Object} res - express response
 * @param {Function} next - express callback
 * @async
 */
export async function FrontLessMidleware(req, res, next) {
  if (req.headers.accept &&
      req.headers.accept.includes('/json')) {
    return next();
  }
  const tagName = resolvePageName(req.params [0]);
  const notFound = (err) => {
    return err.message && err.message.includes(`'class' of undefined`);
  };
  const serverError = async (e) => {
    res.status(500).end(
        await renderPage(resolvePageName('errors-server-error'), {
          message: e.message,
          stack: e.stack,
          req,
        })
    );
  };
  try {
    const data = await renderPage(tagName, {req});
    return res.end(data);
  } catch (e) {
    if (notFound(e)) {
      try {
        const index = tagName.replace(
            'front-less-page',
            'index-front-less-page'
        );
        return res.status(200).end(
            await renderPage(index, {req})
        );
      } catch (err) {
        if (notFound(err)) {
          return res.status(404).end(
              await renderPage(resolvePageName('errors-not-found'), {req})
          );
        } else {
          return serverError(err);
        }
      }
    } else {
      return serverError(e);
    }
  }
};

export default (services, configure) => {
  configure(app, express);
  app.use('/*', FrontLessMidleware);
  services(app);
  return app;
};
