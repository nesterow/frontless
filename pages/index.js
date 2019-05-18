const riot = require('riot')
const {assign} = require('lodash')
const {enumerateTags, plugin} = require('frontless-utils')
const hydrate = require('@riotjs/hydrate')
const EventBus = require('eventbusjs')
const Turbolinks = require('turbolinks')
Turbolinks.start()


riot.install(function(component){

  enumerateTags(component)

  component.onServerState = function (response) {
    this.state = assign(this.state, response.target.result.data)
    this.update()
  }.bind(component)

  const onMounted = component.onMounted || function () {}.bind(component)
  const eventName = (component.id || component.name) + ':update'

  component.onMounted = function (props, state) {
    EventBus.removeEventListener(eventName, component.onServerState.bind(this), component)
    EventBus.addEventListener(eventName, component.onServerState.bind(this), component)
    return onMounted.bind(this)(props, state)
  }.bind(component);

})

const tags = require('./**/*.riot', {mode: 'list'})
  .concat(require('../components/**/*.riot', {mode: 'list'}))

// Plug-in pages and tags
plugin(require('frontless-plugin/pages'), tags)


const initialize = () => {
 
  const STATE = JSON.parse(
    decodeURIComponent(document.querySelector('meta[name="state"]').getAttribute('content'))
  )

  const ATTRS = JSON.parse(
    decodeURIComponent(document.querySelector('meta[name="attributes"]').getAttribute('content'))
  )

  tags.forEach((tag) => {
    const component = tag.module.default
    if (component.exports) {
      component.exports.state = STATE[component.exports.id || component.name] || component.exports.state
      const attributes = ATTRS[component.exports.id || component.name]
      if (attributes) attributes.map((attr) => {
        component.exports[attr.name] = attr.data
      })
    }
    try { 
      riot.register(component.name, component)
    } catch(e) {}
  })

  const root = document.querySelector('section[is]')
  if (root) {
    document.body.classList.add('disabled')
    const ComponentImplementation = tags.find((tag) => tag.module.default.name === root.getAttribute('is') )
    const component = ComponentImplementation.module.default

    // while (root.firstChild) {
    //   root.firstChild.remove()
    // }
    
    // const mounted = riot.mount(root, component)
    hydrate(component)(root)
    setTimeout(() => document.body.classList.remove('disabled'))
  }

}
window.initialize = initialize;
document.addEventListener('turbolinks:load', initialize);
document.addEventListener('hmr:updated', () => location.reload())

