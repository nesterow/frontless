import { Server } from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import ssr from 'react-ssr'

import routes from './routes'
import Html from './pages/Html.jsx';

const app = express()
const router = express.Router()
const renderer = ssr({ 
  routes,
  Html
})

app.use('/assets', express.static('assets'));
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }))

app.get('/*', renderer)

new Server(app).listen(8000, err => {
  if (err) {
    return console.error(`👎  ${err}`)
  }

  console.info(`👍  Server launched at: localhost:8000`)
})
