const riot = require('riot')
const {SheetsRegistry} = require('jss')


/** 
 * Render a riot tag.
 * This method resolves all `fetch()` operations including components children
 * TODO: A global store, maybe Mobx?
 * @return {Promise<{output: String, state: Object, layout: string}>}
 * */
module.exports = async function renderAsync(tagName, component, props, sharedAttributes) {
  
  if (global.document === void 0) {
    const {JSDOM} = require('jsdom')
    const {document,Node} = new JSDOM().window
    global.document = document
    global.Node = Node
  }
  try {
    const root = document.createElement(tagName)
    const element = riot.component(component)(root, props)
    const prop = riot.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY
    const stylesheet = new SheetsRegistry()

    let state = {}
    let shared = {}
    if (element) {
      element.req = props.req;
      element.res = props.res;
      if (element.fetch)
        await element.fetch(props);

      if (element.onServer)
        element.onServer(props.req, props.res, props.next);

      state[element.id || component.name] = element.state
      shared[element.id || component.name] = sharedAttributes.map((name) => ({name, data: element [name]}))
      
      if (element.stylesheet) {
        stylesheet.add(element.stylesheet)
      }
    }

    const elements = element.$$('*')

    for (let i in elements) {
      const el = elements [i]
      let instance = el [prop]
      if (instance) {
        instance.req = props.req;
        instance.res = props.res;
        if (instance.fetch)
          await instance.fetch(props);
        
        if (instance.onServer)
          instance.onServer(props.req, props.res, props.next);

        state[instance.id || instance.name] = instance.state
        shared[instance.id || instance.name] = sharedAttributes.map((name) => ({name, data: instance [name]}))
        instance.update()
        
        if (instance.onRendered) {
          instance.onRendered(props)
        }
        if (instance.stylesheet) {
          stylesheet.add(instance.stylesheet)
        }
      }
    }
    element.update()
    if (element.onRendered) {
      element.onRendered(props)
    }
   
    element.$$('input,textarea,select,option').map((el) => {
      const value = el.type !== 'password' ? el.value : ''
      el.setAttribute('value', value || '')
    })
    
    const head = document.head.innerHTML
    const output = element.root.outerHTML
    
    element.unmount()
    // cleanup()
    const {layout = 'base'} = typeof component.exports === 'function' ? component.exports() : (component.exports || {})
    state = JSON.stringify(state)
    shared = JSON.stringify(shared)
    const style = stylesheet.toString()
    return Promise.resolve({output, state, shared, layout, head, stylesheet: style })
  }
  catch(e) {
    return Promise.reject(e)
  }
}