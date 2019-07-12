module.exports = {

  IS_PWA: false,

  WEBSOCKETS: true,

  COOKIE_NAME: 'frontless-jwt',

  // cache in PWA mode
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