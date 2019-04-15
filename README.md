# react-ssr-examples

This repository aims to provide you with a reasonable base to refer to on recommended approaches for getting started with react-ssr. Generally speaking, we advise you use babel (to make use of our babel plugin) and a module bundler to produce a server bundle and client bundle. In our example we'll use Webpack.

Also, as a heads up, these examples use StandardJS, because it's beautiful. Don't be put off by the lack of semi-colons.

## Generic setup

Assuming a simple Node server with Express, you'll need to instantiate react-sst and pass in any of the `options` listed lower down. An array of static React routes is the only thing required (you should put the array in a separate file, unlike the example...).

```js
import express from 'express'
import ssr from 'react-ssr'
import HomePage from './HomePage'
import NotFoundPage from './NotFoundPage'

const app = express()
const renderer = ssr({
  routes: [
    {
      path: '/',
      exact: true,
      component: HomePage
    },
    {
      path: '/about',
      redirectTo: '/'
    },
    {
      path: '**',
      component: NotFoundPage
    }
  ]
})

app.get('*', renderer) // send all routes to ssr
```