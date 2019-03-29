import frontless from 'lib/server';
import services from './api';
import 'tags/views/layout.tag';
import './pages';

const application = frontless(services, (app, express) => {
  app.use('/dist', express.static('dist/public'));
});

application.listen(5050);
