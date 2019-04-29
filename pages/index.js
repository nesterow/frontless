const riot = require('riot')
const {isTagRegistered, hydrate} = require('frontless-utils')
const EventBus = require('eventbusjs')
const Turbolinks = require('turbolinks')
Turbolinks.start();


riot.install(function(component){
  
  component.onServerState = function (data) {
    component.update(data);
  }.bind(component);

  const onMounted = component.onMounted || function () {};
  const eventName = (component.id || component.name) + ':update'

  component.onMounted = function (props, state) {
    EventBus.removeEventListener(eventName, component.onServerState, component)
    EventBus.addEventListener(eventName, component.onServerState, component)
    return onMounted.bind(this)(props, state)
  }.bind(component);

})

const tags = require('./**/*.riot', {mode: 'list'})

document.addEventListener('turbolinks:load', ()=>{
  const STATE = JSON.parse(
    document.querySelector('meta[name="state"]').getAttribute('content')
  )

  tags.forEach((tag) => {
    const component = tag.module.default;
    if (component.exports) {
      component.exports.state = STATE[component.exports.id || component.name] || component.exports.state;
    }
    if (!isTagRegistered(component.name)) { 
      riot.register(component.name, component)
    }
  })

  const root = document.querySelector('section[is]')
  // root.innerHTML = '';
  // riot.mount(root)
  const ComponentImplementation = tags.find((tag) => tag.module.default.name === root.getAttribute('is') )
  const component = ComponentImplementation.module.default;
  const hydrated = hydrate(root, component, component.props);

});

