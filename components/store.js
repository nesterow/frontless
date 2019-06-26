const {isBrowser} = require('@frontless/core')
const store = require('@frontless/redux')

const state = isBrowser && document.__GLOBAL_SHARED_STATE || {
  title: '',
}

const actions = {

  TITLE: function(state, {title}) {
    state.title = title
  },

}



module.exports = store({
  state,
  actions,
})