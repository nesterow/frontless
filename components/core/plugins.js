const PLUGIN_REGISTRY = [];

module.exports.install = (plugin) => {
  if (PLUGIN_REGISTRY.includes(plugin))
    return console.log(plugin.name, 'already installed');
  PLUGIN_REGISTRY.push(plugin);
}

module.exports.plugin = (pages, tags) => {
  pages.map( tag => {
    tags.push(tag)
  })
}

module.exports.withPlugins = (app, dirname) => {

  app.on('setup', (app) => {
    PLUGIN_REGISTRY.map((plugin)=> {
      if (plugin.setup) {
        console.log('🔌 ', plugin.name + ':', 'initializing middlewares');
        plugin.setup(app, dirname)
      }
    })
  })
  
  app.on('setup:ssr', (app) => {
    PLUGIN_REGISTRY.map((plugin)=> {
      if (plugin.setupSSR) {
        console.log('🔌 ', plugin.name + ':', 'initializing SSR middlewares');
        plugin.setupSSR(app, dirname, module.exports.FrontlessMiddleware)
      }
    })
  })

  app.on('connected', (app, db) => {
    PLUGIN_REGISTRY.map((plugin)=> {
      if (plugin.connected) {
        console.log('🔌 ', plugin.name + ':', 'initializing middlewares after connection');
        plugin.connected(app, db, dirname)
      }
    })
  })
  
}
