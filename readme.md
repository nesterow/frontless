<img src="https://github.com/nesterow/frontless/raw/master/assets/media/logo.png" height="50"/> 

[![Build Status](https://travis-ci.org/nesterow/frontless.svg?branch=master)](https://travis-ci.org/nesterow/frontless)
![version](https://img.shields.io/badge/Version-0.5.2@alpha-yellow.svg)
![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)

<a href="https://h5l5o.sse.codesandbox.io/" target="_blank">
  ⚙ View demo on CodeSandbox.io
</a>


## Riot Isomorphic Stack
*Frontless* is an isomorphic web framework built for next generation web applications. 
It lets you build server-side rendered web applications using [RiotJS](https://riot.js.org) and [FeathersJS](http://feathersjs.com).
At the core, *Frontless* is just an `express.js` server that provides routing, data access, web sockets and user sessions

- It is just an express.js aplication you can customize at will
- It is built with ❤️ RiotJS.
- It provides natural HTTP routing `[page.riot -> GET /page]`
- It uses FeathersJS on client and server
- It allows to update components' state directly from server response
- It renders pages after all async operations complete ✊

### The Stack
Before you start, it is highly recommended to have essential understanding of following technologies:
<br>
[FeathersJS](https://github.com/feathersjs/feathers) | 
[RiotJS](https://github.com/riot/riot) |
[Turbolinks](https://github.com/turbolinks/turbolinks) |
[ExpressJS](https://github.com/expressjs/express)
<details><summary>Stack summary</summary>

| SERVER        | CLIENT        |
| :------------- |:-------------|
| Routing *[express.js]* | Navigation *[turbolinks]* |
| View Model *[feathers]*    | Data Representation *[riot.js]* |
| Layout Rendering *[riot/ssr]* | User input *[riot.js]*  |
| Sessions *[express.js]* | JWT, Cookies |
| Realtime *[feathers, socket.io]* | FeathersJS Client |
| DB Interface *[@feathers/client]* | Rest/IO *[@feathers/client]* |

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

**Natural routing**

All files ending with *.riot extension that placed in the pages directory become site pages. It works similar to php scripts or html pages. For example: [`index.riot -> GET /`, `page.riot -> GET /page`].

**Async SSR**

The pages in Frontless are rendered after all fetch operations in children components are complete. Which means you can make asyncronous queries in children components and don't worry that the server return markup before data is fetched.

**Server sent state**

Some API requests can return a ready view-model for a specific component. After it happens, the target component will update its state from received response. This is convenient whenever you want to update the view after a request is done. Given that, the server should return a ready view-model which eliminates extra steps you would do to handle response.

**State initialization**

All Riot components rendered on the server side initialize in browser with last state they were on the server side. 

**Browser caching**

If your application needs SPA experience you can cache the pages using webworker module.

**RestAPI/Socket.io**

Stay close to the database with power of FeathersJS services.

**It is just Express**

Everything you can do with an express application.

## [Documentation](https://nesterow.github.io/frontless/)
[Frontless Docs](https://nesterow.github.io/frontless/) | [Feathers Docs](https://docs.feathersjs.com/) | [Riot Docs](https://riot.js.org/)

## Contrubute ❤️

If you found a problem and know the solution:
- Fork repository
- Fix the problem
- Push your fix to a separate branch
- Make pull request to the `development` branch

If you need help, just [open an issue](https://github.com/nesterow/frontless/issues)

If you understand how it works under the hood, or feel like you can make this project better don't hesitate to message me directly.

## License

This project is licensed under the MIT License - see the [LICENSE.md](.github/LICENSE.md) file for details



## Roadmap v1.0

* [x] Async SSR
* [x] Natural Routing  
* [x] Database Interface
* [x] Users and Sessions
* [x] Server Sent State (w/feathers.js)
* [x] Socket IO (w/feathers.js)
* [x] Plugin support
* [ ] Configuration
* [ ] Deployment scripts
* [ ] PWA Bootstrap [80%]
* [ ] Documentation [15%]


## Authors

* **Anton Nesterov** - [@nesterow](https://github.com/nesterow)

## Credits
* **Gianluca Guarini** - [@GianlucaGuarini](https://github.com/GianlucaGuarini) - *[riot/hydrate](https://github.com/riot/hydrate)*, *[Riot.js](https://github.com/riot/riot)*

