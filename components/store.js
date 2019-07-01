import {isBrowser} from '@frontless/core'
import store from '@frontless/redux'

const state = isBrowser && document.__GLOBAL_SHARED_STATE || {
  title: '',
}

const actions = {

  TITLE: function(state, {title}) {
    state.title = title
  },

}



export default store({
  state,
  actions,
}, 
function() {
  return isBrowser ? document : require('@frontless/core/src/mutex').release();
})