(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {

  CACHE_ASSETS: [
    '/assets/application.js',
    '/assets/media/logo.png'
  ],

  CACHE_PAGES: [
    '/playground',
    '/playground/state',
    '/playground/form',
    '/playground/todo',
    '/playground/routes',
    '/playground/users',
  ],

}
},{}],2:[function(require,module,exports){

const {CACHE_ASSETS, CACHE_PAGES} = require('./config')

const __ALL__ = [...CACHE_ASSETS, ...CACHE_PAGES]

const message = (msg) => {
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(msg)
    })
  })
};

const isPage = (string) => {
  return CACHE_PAGES.filter(e => (string || '').endsWith(e)).length
}

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open('appdata').then(
    (cache) => {
      return cache.addAll(__ALL__)
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('appdata')
      .then (cache => {
        return cache.match(event.request)
          .then(function(response) {
            // return immediately and delete from cache
            // then ask turbolinks to revisit location
            if (response && isPage(event.request.url)) {
              message({ type: 'before:revisit', url: event.request.url })
              setTimeout(() => {
                cache.delete(event.request).then((success)=>{
                  if (success) {
                    message({ type: 'revisit', url: event.request.url })
                  }
                })
              },100);
              
              return response.text().then((text) => {
                
                try {
                  return new Response(text.replace('<body', '<body from-cache="true" '), {
                    headers: new Headers([
                      ['Content-Type', 'text/html']
                    ]),
                    status:     response.status,
                    statusText: response.statusText,
                    type: response.type
                  })
                } catch(e) {
                  return new Response(text, {
                    status:     response.status,
                    statusText: response.statusText,
                    type: response.type
                  })
                }
                
              })
            }

            // (revisit) get fresh data from server and put it  in cache
            else if (!response && isPage(event.request.url)) {
              return cache.addAll(
                  CACHE_PAGES.filter((page) => { 
                    return event.request.url.endsWith(page)
                  })
                ).
                then(() => {
                  message({ type: 'after:revisit', url: event.request.url })
                  return cache.match(event.request)
                })
            }


          // handle other requests normally
          return response || fetch(event.request).then((data) => {
            return data
          })
           
            
          }
        )
    })
  );
})

},{"./config":1}]},{},[2]);
