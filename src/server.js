
import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
// import express from 'express';
import {renderPage, resolvePageName} from 'lib/render';
import frontless from 'lib/server/express';
import services from './api';

import './pages';

const api = feathers();
const app = express(api);

frontless(app);
frontless(api);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.configure(express.rest());
app.use('/dist', express.static('dist/public'));

app.use('/*', async (req, res, next) => {
  if (req.headers.accept &&
      req.headers.accept.includes('/json')) {
    return next();
  }
  try {
    const tagName = resolvePageName(req.params [0]);
    res.end(
        await renderPage(tagName, {
          title: 'Ello',
          req,
        })
    );
  } catch (e) {
    if (e.message && e.message.includes(`'class' of undefined`)) {
      return res.status(404).end(
          await renderPage(resolvePageName('not-found'), {})
      );
    } else {
      res.status(500).end(
          await renderPage(resolvePageName('server-error'), {
            message: e.message,
            stack: e.stack,
          })
      );
    }
  }
});

services(app);

app.listen(5050);
