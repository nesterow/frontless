<img src="https://github.com/nesterow/frontless/blob/develop/assets/media/logo.svg" height="50"/> 

[![Build Status](https://travis-ci.org/nesterow/frontless.svg?branch=master)](https://travis-ci.org/nesterow/frontless)
[![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/nesterow/frontless)
![version](https://img.shields.io/badge/Version-1.0.0@alpha-yellow.svg)
![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)

<p style="color: green;"> Feathers + Riot + Turbolinks + Express</p>
<a href="https://t6mj3.sse.codesandbox.io/" target="_blank">
  <img src="https://codesandbox.io/favicon.ico" height="20"/> View demo on CodeSandbox.io
</a>


## About

Frontless is a node.js stack for building universal (ismorphic) javascript applications. At the core, Frontless is just a small Express server that provides a developer with powerful tools for building SSR web applications.

Frontless is built around the best javascript technologies: Feathers.JS , Riot.JS, Turbolinks, and Express.

#### Motivation

In practice, the classic MMVM approach significantly complicates work with data. That causes a front-end developer to write the code, which would be better performed by the server rather than a browser application. The server has to be responsible for things like routing, data requests, user state (sessions), and in some cases - component's view-model. It would make a front-end developer better concentrate on UI rather than repeating the functionality which is done by back-end in more reliable way.

#### The Stack

Before you start, it is highly recommended to have essential understanding of following technologies:
<br>
[FeathersJS](https://github.com/feathersjs/feathers) | 
[RiotJS](https://github.com/riot/riot) |
[Turbolinks](https://github.com/turbolinks/turbolinks) |
[ExpressJS](https://github.com/expressjs/express)
<details><summary>Stack summary</summary>


| SERVER        | CLIENT        |
| :------------- |:-------------|
| Routing - *express.js* | Navigation - *turbolinks* |
| View Model - *feathers*    | Data Representation - *riot.js* |
| Layout Rendering - *riot/ssr* | User input - *riot.js*  |
| Sessions - *express.js* | *JWT, Cookies* |
| Realtime - *feathers, socket.io]* | *@feathers/client* |
| DB Interface - *@feathers/client* | Rest/IO - *@feathers/client* |


</details>

## Getting Started

1. Clone [this repo](https://github.com/nesterow/frontless) or use NPX

```
  npx create-frontless <app-name>
```
2. Setup a MongoDB Server (optional). Frontless reads `MONGODB_URI` environment variable.
```
  # config.env
  MONGODB_URI=mongodb://localhost:27017/frontless
```
3. Install dependencies and start dev. server
```
  npm run install
  npm start
```
Оpen [http://localhost:6767](http://localhost:6767) in your browser. Navigate to the playground for examples 

## Features

**Simple routing scheme**

Routing in-web applications should be as simple as it is in static sites. With that in mind, any Riot.JS component placed in the pages directory is accessible by browser: [`index.riot -> GET /`, `page.riot -> GET /page`].

Also, a page can accept positional arguments and it also has access to the Express request context:
```javascript
// GET https://example.com/foo@bar;baz
export default {
  async fetch(){
    const {args} = this.req.params;
    const [arg1, arg2] = args;
    console.log(arg1 === 'bar') // true
    // arg2 = baz
  }
}
```

**Synchronous rendering**

Frontless can render pages after all asynchronous calls are complete. Including children riot components nested inside the page markup.

**Server-sent state**

Some API requests can return a ready view-model for a specific component. After it happens, the target component will update its state from received response. This is convenient whenever you want to update the view after a request is done. Given that, the server should return a ready view-model which eliminates extra steps you would do to handle response.

**State initialization**

All Riot components rendered on the server side initialize in browser with last state they were on the server side. 


**RestAPI/Socket.IO**

Stay close to the database with power of FeathersJS services.

**It is just Express.JS**

Everything you can do with an express application.

## Documentation
[Frontless Docs](https://frontless.js.org) | [Feathers Docs](https://docs.feathersjs.com/) | [Riot Docs](https://riot.js.org/)

## ❤️ Contribute

If you found a problem and know the solution:
- Fork repository
- Fix the problem
- Push your fix to a separate branch
- Make pull request to the `development` branch

If you need help, just [open an issue](https://github.com/nesterow/frontless/issues)

If you understand how it works under the hood, or feel like you can make this project better don't hesitate to message me directly.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/nesterow/frontless/blob/master/LICENSE) file for details

## Changelog v1.0.x

### v1.0.0

* [x] Replace browserify-hmr module with more reliable feature [#62](https://github.com/nesterow/frontless/issues/62)
* [x] SSR
* [x] Natural Routing  
* [x] Database Interface
* [x] Users and Sessions
* [x] Server Sent State (w/feathers.js)
* [x] Socket IO (w/feathers.js)
* [x] Plugin support
* [x] Configuration
* [x] Modify RiotJS to work with DI (inject `document`, `Node`, and global ctx)

## Roadmap v2.0
* [ ] Static site builder [10%]
* [ ] Global state syncronization
* [ ] Push Notifications

## Authors

* **Anton Nesterov** - [@nesterow](https://github.com/nesterow)

## Credits
* **Gianluca Guarini** - [@GianlucaGuarini](https://github.com/GianlucaGuarini) - *[riot/hydrate](https://github.com/riot/hydrate)*, *[Riot.js](https://github.com/riot/riot)*

