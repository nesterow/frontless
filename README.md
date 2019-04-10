# FRONTLESS 
##### FeathersJS, RiotJS, Turbolinks Isomorphic Stack.
##### Version: [pre-alpha]

### About
A library for building _isomorphic_ applications with RiotJS. 
_Frontless_ isn't a framework, it is rather _a library_ that glues awesome technologies in a single _stack_.

_Frontless_ provides a way of building web appications with SPA user experience with less effort.
Instead of communicating with REST API in a stadard way, _Frontless_ expects to receive a ready component state from the server and then updates UI.

### Getting Started
```sh
  ~$ npx frontless <app-name>
```

### Changelog
1. ~~Isomorphic async rendering helpers~~
2. ~~Syncronize inital state of the components. BE -> FE~~
3. ~~Use RiotJS tags as a templates on BE~~
4. ~~Find solution for routing using `src/pages` as a root~~
5. ~~Add error views, handle routing errors~~
6. ~~Find a solution to mount components from html chunks~~
7. ~~Implement shared state transport using feathersjs~~
8. Implement session/auth middlewares [80%]
9. Write documentation