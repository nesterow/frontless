module.exports = (app) => {

  const emulateDelay = () => new Promise((resolve) => {
    setTimeout(resolve, 100);
  })

  app.use('random-number', {

    async create() {
      await emulateDelay();
      return app.setState('random-number-id', {
        randomNumber: parseInt(Math.random() * 100000)
      })
    },


  })
}