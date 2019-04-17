
import Playground from '@@/Playground/Playground.jsx';
import HomePage from './pages/HomePage/index'
import AboutPage from './pages/AboutPage/index'
import NotFoundPage from './pages/NotFoundPage/index'

const routes = [
  {
    path: '/',
    exact: true,
    component: HomePage
  },
  {
    path: '/about',
    exact: true,
    component: AboutPage
  },
  {
    path: '/playground',
    component: Playground
  },
  {
    path: '**',
    component: NotFoundPage
  }
]

export default routes
