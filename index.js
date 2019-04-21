const fs = require('fs')
const ejs = require('ejs')
const express = require('@feathersjs/express')
const feathers = require('@feathersjs/feathers')
const register = require('@riotjs/ssr/register')
register();

const riot = require('riot')



const api = feathers()
const app = express(api)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.configure(express.rest())


function resolvePath(path) {

  try {
    const fullPath = ('pages/' + path )
    .replace(/\/\//g, '/').replace(/\/$/, '')
  
    if (fs.statSync(fullPath + '/index.riot').isFile())
      return fullPath + '/index.riot';

    if (fs.statSync(fullPath + '.riot').isFile())
      return fullPath + '.riot';
  
  } catch (e) {

    return false;

  }

}

async function render(tagName, component, props) {
  const cleanup = require('jsdom-global')()
  const root = document.createElement(tagName)
  const element = riot.component(component)(root, props)
  const prop = riot.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY
  const elements = element.$$('*')
  
  let state = {};
  for (let i in elements) {
    const el = elements [i]
    let instance = el [prop]
    if (instance) {
      await instance.fetch(props);
      state[instance.id || el.tagName] = instance.state;
    }
  }
  element.update()
  const output = element.root.outerHTML
  cleanup()
  state = JSON.stringify(state)
  return Promise.resolve({output, state})
}

app.use('/*', async (req, res) => {

  const path = resolvePath(req.params [0]) || 'pages/errors/404.riot'
  const component = require('./' + path).default
  const {output, state} = await render('section', component, { req, });

  ejs.renderFile('./pages/layout/base.ejs', {req, output, state}, null, function(err, data) {
    
    res.end(data)
  
  })
  

})

app.listen(6767)