
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
