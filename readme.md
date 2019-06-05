<img src="https://github.com/nesterow/frontless/raw/master/assets/media/logo.png" height="50"/>

![version](https://img.shields.io/badge/Version-0.5.2@alpha-yellow.svg)
![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)
[![Open Demo](https://img.shields.io/badge/CodeSandbox-▶-green.svg)](https://l2n8209x5z.sse.codesandbox.io)


## Riot Isomorphic/SSR Stack
Frontless aims to provide classic web development experience with modern approach. 

Classic MVVM approach significanly complicates work with data. In fact, on practice, a frontend developer would end up writing the code that would be better performed by server rather than a client. I believe that the server has to be responsible for things like _routing_, _data requests_, _user state_, and and some cases _component's view-model_. Theese are routines that the server does better than browser. 

- It is just an ExpressJS application. 
- It uses FeathersJS on client and server.
- It is built with ❤️ RiotJS.
- It provides **natural routing** `page.riot -> GET /page`
- It allows to update components' state directly from server response

### Getting Started
1. Clone this repo or use NPX

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


### The Stack
Essential understanding of following technologies is _recommended_.

| Server        | Client        |
| ------------- |:-------------:|
| Routing (Express.JS ) | Navigation (Turbolinks) |
| View Model (FeathersJS)    | Data Representation (RiotJS) |
| Layout Rendering (RiotJS SSR) | User input (RiotJS)  |
| Session / User State (Express.js) | JWT, Cookies |
| Realtime (Feathers, SocketIO) | FeathersJS Client |
| DB Interface (FeathersJS Client) | Rest/IO (FeathersJS Client) |

[![FeathersJS](https://img.shields.io/badge/FeathersJS-3.3.1-green.svg)](https://github.com/feathersjs/feathers)
[![RiotJS](https://img.shields.io/badge/RiotJS-4.0.2-green.svg)](https://github.com/riot/riot)
[![Turbolinks](https://img.shields.io/badge/Turbolinks-5.2.0-green.svg)](https://github.com/turbolinks/turbolinks)
[![ExpressJS](https://img.shields.io/badge/Express-4.16.4-green.svg)](https://github.com/expressjs/express)


### Core concepts

#### Natural Routing
All files ending with `*.riot` placed in the `pages` become site pages, much like php scripts or html pages.
[`index.riot -> GET /`, `page.riot -> GET /page`]

#### Passing arguments in url
Passing positional argument to the page is possible trough `@` modifier. A semicolon-separated string after `@` will be parsed as positional arguments.
For example consider following request:
```
GET /page@some_id;data?q=1
```
This request will fetch `page.riot` and pass positional arguments into 'request.params.args':
```javascript
export default {
  async fetch(props){
    const {req} = props;
    const [user_id, data] = req.params.args;
  }
}
```


#### Server side rendering
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

#### Server sent state
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

#### Access control
Access to pages can be controlled trough options set in the `access` property:
```
export default ()=> ({
  access: {
    loggedIn: true,
  },
  state:{},
  ...
})
```
By default two options are awailable: `loggedIn` and `group`.

### Authentication
Authentication is impemented with [@feathersjs/authentication-local](https://docs.feathersjs.com/api/authentication/local.html) module. 
In order to customize user model you need to modify [verifier class](./components/verifier.js) and [the plugins](./plugins.js)

### Security
- Under no circumstances, It is NOT recommended to turn off the *CORS middlewares*.
- When working with Riot Components, it is NOT recommended to use sensitive variables or use any sentive data as open text
- When working with Riot Components, is is HIGHLY recommended to use functional approach. Every component should be returned from a function like `export default ()=> ({...component})`. This is needed to avoid [module caching](https://nodejs.org/api/modules.html#modules_caching) 



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
