module.exports = ({
  name: 'Example plugin',
  setup(app, dirname) {
    app.use((req, res, next) => {
      // console.log('Example plugin middleware')
      next();
    })
  },
  setupSSR(app, dirname, Middleware) {
    app.use('/test-plugin/*', Middleware(dirname, ['styles'], {
      __dirname,
    }))
  },
  connected(app, db, dirname) {
    require('./services')(app,db, dirname)
  }
})