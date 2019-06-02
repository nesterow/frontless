
navigator.serviceWorker.register('/worker.js')
    .then(reg => {
      
    })
    .catch(err => console.log('Boo!', err));

navigator.serviceWorker.addEventListener('message', (event) => {
  switch(event.data.type) {
    case 'revisit':
      Turbolinks.visit(event.data.url)
      break;
    default:
      break;
  }
})