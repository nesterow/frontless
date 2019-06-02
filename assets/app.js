
navigator.serviceWorker.register('/worker.js')
    .then(reg => {
      console.log('SW registered!', reg)
    })
    .catch(err => console.log('Boo!', err));

navigator.serviceWorker.addEventListener('message', (event) => {
  console.log(123, event.data)
})