![RiotJS Isomorphic Stack - Riot + FeatherJS + Turbolinks + Webpack](https://github.com/nesterow/frontless/raw/master/assets/logos/techs.png)
### RiotJS Isomorphic Stack

_Frontless_ was inspired by technologies like Next.js and Meteor. It is built for rapid web development and prototyping. 


## Features

#### 1. Server Sent State
###### "Server Sent View Model"
Classic MVVM approach significanly complicates work with data. In fact, on practice, a frontend developer would end up writing the code that would be better performed by server rather than a client (requesting data, filtering data, cooking a view model, caching, etc). I believe that the server has to be responsible for the view model. There are things which the server does better and working with data is one of them. Frontend's responsibility is to render a view.

_Server Sent State_ is simply a JSON-formatted message with a component state. If the message was intended for a certain component the contents of message would merge with component's state updating UI.

#### Example
###### Server Side (feathers.js)
```javascript
//...
get() {
   return MESSAGE('component-id',{
       title: "Hello World"
   });
}
//...
```
###### Client Side (riot.js)
```javascript
    //...
    this._id = 'component-id';
    this.title = "";
    client.service('/example')
    .get().then(()=>{
        console.log('Title:', this.title)
    })
    //...
```

#### 2. Natural Routing
Instead of writing routing manifests and rendering layouts on the browser _Frontless_ does it on the server side. All html content in `src/pages` is rendered by server as RiotJS templates. All page layouts are _server side components_ they don't share javascript code with the client generating markup on the server side. However, all the components included in the pages _do share javascript code with the browser_.

##### Examples
###### Home Page (`pages/index.tag.html`). At `https://example.com/`
```html
<index-page>
    <html>
        <-- RiotJS components included below will be 
        rendered in the browser as well -->
        <datepicker value="today"></datepicker>
    </html>
    <script>
        //it won't render on the client side
        this.today = new Date().now()
    </script>
</index-page>
```
###### A root page (`pages/notes/index.tag.html`). At `https://example.com/notes`
```html
<notes-page>
    <html></html>
    <script>
    </script>
</notes-page>
```

###### Other page (`pages/notes/edit.tag.html`). At `https://example.com/notes/edit`
```html
<notes-edit-page>
    <html></html>
    <script>
    </script>
</notes-edit-page>
```

#### 3. Async Rendering
In order to synchrinize data access and render _Frontless_ provides two methods in the contexts of all riot components: `this.await()` and `this.done()`. The render function will complete rendering whenever the last `done()` call is made. 

##### Example
###### Getting all data then rendering component

```html
<profile>
    <div>markup</div>
    <script>
        import client from 'lib/client';
        this.onServer(async ()=>{
            this.await('get user profile')
            const userId = this.opts.req.session.id; 
            this.profile = await client.service('users').get(userId);
            this.messages = await client.service('msg').get(userId)
            this.done('get user profile') // component is ready
        })
    </script>
</profile>
```


### Isomorphic context

1. `this.opts.req` - points to express.js request object (server).
2. `this.onServer(callback)` - executes when a component mounts on server.
3. `this.onClient(callback)` - executes only on the client side.
4. `this.form(HTMLFormElement)` - serialize form to an object. On client.
5. `lib/client` - FeathersJS client. Isomorphic.
6. `this.bus` - A global eventbus. Isomorphic.
7.  `this.pushQuery(object)` - push url query. Isomorphic.
8. `this.getQuery()` - get serialized url query. Isomorphic.
9. `this.replaceQuery(object)` - push url query. Isomorphic.
10. `this.rootPath()` - current url path. Isomorphic.
11. `this.route(pattern)` - Matches current subroute after layout entry against a pattern. `https://example.com/notes/edit/archived/:id` would match `/:type/:id` if `/notes/edit/` is a page.
12. `this.notFound()` - true if a subpath does not match any pattern.



## Getting Started

#### 1. Create an application
`npx frontless <app-name>` or `npx create-frontless <app-name>`
```
  yarn
  yarn start
```
Then open [http://localhost:5050](http://localhost:5050) in your browser. Navigate to the playground for examples 

#### 1. Create your first page
Create a file named `mypage.tag.html` in `src/pages/`
###### `src/pages/mypage.tag.html`
```html
<mypage>
  <html>
    <h1>Hello World!<h1>
  </html>
</mypage>
```
Then open [http://localhost:5050/mypage/](http://localhost:5050/mypage/) in your browser.

#### 2. Create a riot tag
Create a file named `greeting.tag.html` in `src/tags/`
###### `src/tags/greeting.tag.html`
```html
<greeting>
  <h1>Hello {name}!<h1>
  <script>
    this.name = 'John';
  </script>
</greeting>
```

#### 3. Add riot tag to the page
###### `src/pages/mypage.tag.html`
```html
<mypage>
  <html>
    <greeting></greeting>
  </html>
  <script>
    import 'tags/greeting.tag.html';
  </script>
</mypage>
```

#### 3. Handle user input
Now in the `greeting.tag.html` add a basic event handler.
Reload the page and try pressing the button.
###### `src/tags/greeting.tag.html`
```html
<greeting>
  
  <h1>Hello {name}!<h1>
  <button onclick={countClicks}> Count {count} </button>

  <script>
    this.name = 'John';
    this.count = 0;
    
    this.countClicks = (ev) => {
      this.count ++;
    }
  </script>
</greeting>
```

#### 3. Pass parameters in a subroute
Let's play with sub-routes. Whenever you use `this.route('/foo/:bar/)` you can check if the user navigated down to a sub-path.
Subpaths are relative to the page url. In following example we pass username into route as a first parameter.
The same method is used when you need to register a subpath and use `this.$route` object to get data.
###### `src/tags/greeting.tag.html`
```html
<greeting>
  
  <h1 if={ route('/:name') }>Hello { $route.params.name }!<h1>
  <h1 if={ !route('/:name') }>Hello Anon!<h1>

  <button onclick={countClicks}> Count {count} </button>

  <script>
    this.count = 0;
    
    this.countClicks = (ev) => {
      this.count ++;
    }
  </script>
</greeting>
```
Now you can open  `http://localhost:5050/mypage/Adam`. And the component will render a greeting for "Adam". If you reload the page component state won't change. 

#### 4. Working with API and Server Sent State.
The api services are located in the `src/api` directory. 
Frontless uses FeathersJS as a Rest API service. You should refer to the [FeathersJS documentation](https://docs.feathersjs.com/) for more information.

#### 5. Creating a service.
Based on the previos example lets create a service which would update a user based on the paramenters we passed to it.
We will use method 'MESSAGE()' in order to pass state to the component.

###### `src/api/greeting.js`
```javascript
export default (app) => {
  
  const {MESSAGE} = app;

  app.use('greeting', {

    async get(name) {
      
      // send a message to a component with _id='greeter-component'
      return MESSAGE('greeter-component', {

        //the name will be asigned to the 'greeter-component'
        name: name
      
      });

    },

  });
};
```
Now let's add an input 
###### `src/api/greeting.tag.html`
```html
<greeting>
  
  <h1>Hello { name }!<h1>
  
  <input type="text" onchage={ getName } >

  <script>
    import client from 'lib/client';

    this._id = 'greeter-component'; // notice, we need to set a proper id to the component;
    this.name = 'Adam';
    this.getName = (ev) => {
      if (ev.target.value)
        client.service('greeting').get(ev.target.value);
    }
  </script>
</greeting>
```