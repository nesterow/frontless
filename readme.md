![RiotJS Isomorphic Stack - Riot + FeatherJS + Turbolinks](https://github.com/nesterow/frontless/raw/master/assets/media/logo.png)
--------------------------------------------
![Generic badge](https://img.shields.io/badge/Status-Prototype-yellow.svg)
![Generic badge](https://img.shields.io/badge/Version-0.0.1proto-green.svg)
![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)

### RiotJS Isomorphic Stack
Frontless aims to provide classic web development experience with modern approach.
- - - -- - - -- - - -- - - -- - - -- - - -- - - -
*Current state of the project is **Prototype**. 
- - - -- - - -- - - -- - - -- - - -- - - -- - - - 

#### Installation
`npx frontless <app-name>` or `npx create-frontless <app-name>`
```
  yarn
  yarn start
```
Оpen [http://localhost:6767](http://localhost:6767) in your browser. Navigate to the playground for examples 


## About
There are things that the server does better. Frontend's responsibility is to render the view.
Classic MVVM approach significanly complicates work with data. In fact, on practice a frontend developer would end up writing the code that would be better performed by server rather than a client (routing, requesting data, filtering data, cooking a view model, caching, etc). 
I believe that the server has to be responsible for the view model. There are things which the server does better and working with data is one of them.


## The Stack
| Server        | Client        |
| ------------- |:-------------:|
| Routing (Express.JS ) | Navigation (Turbolinks) |
| View Model (FeathersJS)    | Data Representation (RiotJS) |
| Layout Rendering (RiotJS SSR) | User input (RiotJS)  |
| Session / User State (Express.js) | JWT, Cookies |
| Realtime (Feathers, SocketIO) | FeathersJS Client |
| DB Interface (FeathersJS Client) | Rest/IO (FeathersJS Client) |


## Roadmap v1.0

* [x] Async SSR
* [x] Natural Page Routing  
* [ ] Database Interfaces
* [ ] Users and Sessions
* [ ] Server Sent State (w/feathers.js) [50%]
* [ ] Socket IO (w/feathers.js) [50%]
* [x] Markup Hydration (riot.js) [-]
* [ ] Configuration / Deployment Scripts
* [ ] Template cache on server side based on git hash
* [ ] Deployment scripts
* [ ] PWA Bootstrap w/ version control
* [ ] Documentation
