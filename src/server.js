import './settings';
import dotenv from 'dotenv';
import frontless from 'lib/server';
import services from './api';
import 'tags/views/layout.tag.html';
import 'tags/views/guide.tag.html';
import './pages';

dotenv.config({path: process.argv[process.argv.length - 1]});

const application = frontless(services, (app, express) => {
  app.use('/dist', express.static('dist/public'));
});

application.listen(5050);
