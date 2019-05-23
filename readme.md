<img src="https://github.com/nesterow/frontless/raw/master/assets/media/logo.png" height="50"/>

![Status](https://img.shields.io/badge/Status-Alpha-yellow.svg)
![version](https://img.shields.io/badge/Version-0.0.4alpha.2-yellow.svg)
![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)



### Isomorphic application stack for RiotJS
Frontless aims to provide classic web development experience with modern approach. It was heavily inspired by NextJS.

#### Installation
`npx frontless <app-name>` or `npx create-frontless <app-name>`
```
  yarn
  yarn start
```
Оpen [http://localhost:6767](http://localhost:6767) in your browser. Navigate to the playground for examples 


### The Stack

| Server        | Client        |
| ------------- |:-------------:|
| Routing (Express.JS ) | Navigation (Turbolinks) |
| View Model (FeathersJS)    | Data Representation (RiotJS) |
| Layout Rendering (RiotJS SSR) | User input (RiotJS)  |
| Session / User State (Express.js) | JWT, Cookies |
| Realtime (Feathers, SocketIO) | FeathersJS Client |
| DB Interface (FeathersJS Client) | Rest/IO (FeathersJS Client) |

[![FeathersJS](https://img.shields.io/badge/FeathersJS-3.3.1-green.svg)](https://github.com/feathersjs/feathers)
[![RiotJS](https://img.shields.io/badge/RiotJS-4.0.0@rc.17-yellow.svg)](https://github.com/riot/riot)
[![Turbolinks](https://img.shields.io/badge/Turbolinks-5.2.0-green.svg)](https://github.com/turbolinks/turbolinks)
[![ExpressJS](https://img.shields.io/badge/Express-4.16.4-green.svg)](https://github.com/expressjs/express)


### About
Classic MVVM approach significanly complicates work with data. In fact, on practice, a frontend developer would end up writing the code that would be better performed by server rather than a client. I believe that the server has to be responsible for things like _routing_, _data requests_, _user state_, and and some cases _component's view-model_. Theese are routines that the server does better than browser.


### Features
Frameworks like NextJS or Nuxt attempt to bring client applications to server side, but Frontless tries to be flexible and simple: 
- It is just an ExpressJS application. 
- It uses FeathersJS on client and server.
- It is build with RiotJS.
- It provides **natural routing** `index.riot -> GET /`
- It allows to update component's state directly from request


### Core concepts:

#### 1. Natural Routing
All files ending with `*.riot` placed in the `pages` become site pages, much like php scripts or html pages.
[`index.riot -> GET /`, `page.riot -> GET /page`]


#### 2. Server side rendering
All RiotJS components included in pages will render after all data is fetched. 
Use method `fetch(props)` in your components to make db queries and setting components' state on the server.
Unlike similar method in `next.js`, in Frontless you can fetch data in any children component 
and your page will be rendered after all fetch operations are complete.

```javascript
export default {
  async fetch(props) {
    const {params, session} = props.req
    const userProfile = await db.users.get(session.user.id)
    this.update({
      username: session.username,
      userProfile
    })
  }
}
```

### Server sent state
Some API requests can return a ready view-model for a specific component. 
After it happens the target component will update its state from received response. 
This is convenient whenever you want to update the view after a request is done. 
Given that, the server should return a ready view-model which eliminates extra steps you would do to handle response.

Normally, you should follow 3 steps to make it work:

1. Give your component an unique id
```javascript
export default {
  id: 'uniq-id', // target id
  state: {
    message:''
  }
  ...
}
```
2. Use method app.setState() to compose a response
```javascript
app.use('myservice',{
    async create(data){
      return app.setState('uniq-id', {
        message: 'Hello!'
      })
    }
})
```
3. On the client make a call to service method which suppose to return new state
```javascript
client.service('myservice').create({})
```
Notice that you don't need to handle API call as the server supposed to return ready view-model for your component. 
The UI will update automatically. However, you still nedd to handle loading states and errors.



## Roadmap v1.0

* [x] Async SSR
* [x] Natural Routing  
* [x] Database Interface
* [ ] Users and Sessions
* [x] Server Sent State (w/feathers.js)
* [x] Socket IO (w/feathers.js)
* [x] Plugin support
* [ ] Configuration / Deployment Scripts
* [ ] Template cache on server side based on git hash
* [ ] Deployment scripts
* [ ] PWA Bootstrap w/ version control
* [ ] Documentation
