
import express from 'express';
import {renderPage, resolvePageName} from 'lib/render';
import frontless from 'lib/server/express';

import './pages';

const app = express();
frontless(app);

app.use('/dist', express.static('dist/public'));

app.get('/*', async (req, res, next) => {
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

app.listen(5050);
