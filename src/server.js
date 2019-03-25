
import express from 'express';
import {renderPage} from './lib/render';
import './pages';

const app = express();
app.use('/dist', express.static('dist/public'));
app.get('/', async (req, res, next) => {
  try {
    res.end(
        await renderPage('index', {
          title: 'Ello',
          // req,
        })
    );
  } catch (e) {
    console.log(e);
  }
});

app.listen(5050);
