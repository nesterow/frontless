const version = '1';

const FILES = [
  '/assets/pages/index.js',
  '/assets/media/logo.png',
];

const PAGES = [
  '/playground',
  '/playground/state',
  '/playground/form',
];

const __ALL__ = [...FILES, ...PAGES]

const message = (msg) => {
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(msg)
    })
  })
};

const isPage = (string) => {
  return PAGES.filter(e => (string || '').endsWith(e)).length
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
          .then((response) => {

        // return immediately and delete from cache
        // then ask turbolinks to revisit location
        if (response && isPage(event.request.url)) {
          setTimeout(() => {
            cache.delete(event.request).then((success)=>{
              if (success) {
                message({ type: 'revisit', url: event.request.url })
              }
            })
          },100)
          return response
        }
        // (revisit)
        // get fresh data from server and put it  in cache
        else if (!response && isPage(event.request.url)) {
          return cache.addAll( PAGES.filter((page) => { 
              return event.request.url.endsWith(page)
            })).
            then(() => {
              return cache.match(event.request)
            })
        }

        // handle other requests normally
        return response || fetch(event.request)
      })
  }))
})
