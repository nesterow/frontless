const version = '1';

const FILES = [
  '/assets/pages/index.js',
  '/assets/media/logo.png',
];

const message = (msg) => {
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(msg)
    })
  })
};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('appdata').then( cache => cache.addAll(FILES)))
})

self.addEventListener('activate', event => {
  console.log('V1 now ready to handle fetches!');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('appdata')
      .then (cache => {
          return cache.match(event.request)
            .then(function(response) {
              message('emptyResponse')
              return response || fetch(event.request);
            }
          )
    })
  );
})


