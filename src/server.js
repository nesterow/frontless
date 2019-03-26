
import express from 'express';
import {renderPage, resolvePageName} from './lib/render';
import './pages';

const app = express();
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
    if (e.message.includes(`'class' of undefined`)) {
      return res.status(404).end('not found');
    } else {
      res.status(500).end(e.stack);
    }
  }
});

app.listen(5050);
