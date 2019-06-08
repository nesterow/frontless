<img src="https://github.com/nesterow/frontless/raw/master/assets/media/logo.png" height="50"/>

[![Build Status](https://travis-ci.org/nesterow/frontless.svg?branch=master)](https://travis-ci.org/nesterow/frontless)
![version](https://img.shields.io/badge/Version-0.5.2@alpha-yellow.svg)
![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)
[![Open Demo](https://img.shields.io/badge/CodeSandbox-▶-green.svg)](https://h5l5o.sse.codesandbox.io/)


## Riot Isomorphic Stack
*Frontless* is an isomorphic web framework built for next generation web applications. 
It lets you build server-side rendered web applications using [RiotJS](https://riot.js.org) and [FeathersJS](http://feathersjs.com).
At the core, *Frontless* is just an `express.js` server that provides routing, data access, web sockets and user sessions

- It is just an express.js aplication you can customize at will
- It is built with ❤️ RiotJS.
- It provides natural HTTP routing `[page.riot -> GET /page]`
- It uses FeathersJS on client and server
- It allows to update components' state directly from server response

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

### Getting Started
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

### Documentation
- [Frontless Docs](https://nesterow.github.io/frontless/)
- [FeathersJS](https://docs.feathersjs.com/)
- [RiotJS](https://riot.js.org/)


## Authors

* **Anton Nesterov** - [@nesterow](https://github.com/nesterow)

## Credits
* **Gianluca Guarini** - [@GianlucaGuarini](https://github.com/GianlucaGuarini) - *[riot/hydrate](https://github.com/riot/hydrate)*, *[Riot.js](https://github.com/riot/riot)*

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
