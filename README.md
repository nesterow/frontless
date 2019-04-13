![RiotJS Isomorphic Stack - Riot + FeatherJS + Turbolinks + Webpack](https://github.com/nesterow/frontless/raw/master/assets/logos/techs.png)
RiotJS Isomorphic Stack

Frontless was inspired by technologies like Next.js and Meteor. It is built for rapid web development and prototyping. 

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
###### Home Page (`pages/index.tag.html`)
Accessible at `https://example.com/`
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
###### A root page (`pages/notes/index.tag.html`)
Accessible at `https://example.com/notes`
```html
<notes-page>
    <html></html>
    <script>
    </script>
</notes-page>
```

###### other page (`pages/notes/edit.tag.html`)
Accessible at `https://example.com/notes/edit`
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

#### 4. Isomorphic context

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


