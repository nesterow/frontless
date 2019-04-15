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
    component: AboutPage
  },
  {
    path: '**',
    component: NotFoundPage
  }
]

export default routes
