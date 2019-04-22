// require('module-alias/register')
const EventBus = require('eventbusjs')
const Turbolinks = require('turbolinks')
Turbolinks.start();




const riot = require('riot')
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
  console.log(tags)
  tags.forEach((tag) => {
    const component = tag.module.default;
    if (component.exports) {
      component.exports.state = STATE[component.exports.id || component.name] || component.exports.state;
    }
    if (!riot.__.globals.COMPONENTS_IMPLEMENTATION_MAP.has(component.name)) { 
      riot.register(component.name, component)
    }
  })

  const root = document.querySelector('section[is]')
  root.innerHTML = '';
  riot.mount(root)
});

