// 1. import global libraries like JQuery after this line

import start from '@frontless/core/start'

const PAGES = require('./**/*.riot', {mode: 'list'});
const MODULES = require('../components/**/*.riot', {mode: 'list'});
const components = PAGES.concat(MODULES)

start({ 
  components: components,

  before() {
    // 2. Do somethig before app is hydrated

    require('plugins')
    return Promise.resolve()
  },

  after() {
    
    // 3. Perform actions after application is hydrated
    // require('components/vendor')

  }
});
