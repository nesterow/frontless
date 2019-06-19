
const qs = require('querystring')


module.exports.isServer = (typeof window === 'undefined')

/**
* Serialize a form to object
* @param {HTMLFormElement} element - a <form> element
* @return {object}
*/
module.exports.serializeForm = (element, omit = []) => {
 let result = {};
 new FormData(element).forEach((value, key) => {
   if (!omit.includes(key)) {
     result[key] = value;
   }
 });
 return result;
}

const escapeArg = (str = '') => {
  return str
    .replace(/@/gi, '{~1}')
    .replace(/;/gi, '{~2}')
}

const unescapeArg = (str = '') => {
  return str
    .replace(/\{\~1\}/gi, '@')
    .replace(/\{\~2\}/gi, ';')
}

const getURL = (argsuments = [], query = {}, pathname = null) => {
  const args = argsuments.map( e => escapeArg(e)).join(';')
  const path = (pathname || location.pathname).split('@') [0]
  console.log(args)
  return `${path}${args.trim() ? '@' + args : ''}?${qs.stringify(query)}`
}

module.exports.parseArgs = (args) => {
  if (!args) {
    return
  }
  return args.split(';').map((e) => unescapeArg(e.trim()))
}

const pushState = (argsuments = [], query = {}) => {
  if (typeof window !== 'undefined') 
    history.pushState({}, null, getURL(argsuments, query))
}

/** redirect to specific location. */
module.exports.withRouter = (component) => {
  function redirect(path, argsuments = [], query = {}) {
    if (typeof window === 'undefined') {
      const onServer = component.onServer || (() => {});
      component.onServer = (req, res, next) => {
        onServer(req, res, next)
        res.set('Turbolinks-Location', path)
        res.redirect(301, getURL(argsuments, query, path))
      }
    } else if (window.Turbolinks){
      Turbolinks.visit(getURL(argsuments, query, path))
    }
  }
  component.redirect = redirect.bind(component)
  component.pushState = pushState
  
}

/** Simple hydrate method. Not used at the time */
module.exports.hydrate = function hydrate(el, component, props) {
  const clone = el.cloneNode(false)
  el.parentNode.replaceChild(clone, el)
  return riot.component(component)(clone, props)
}


module.exports.isTagRegistered = function isTagRegistered(name) {
  return riot.__.globals.COMPONENTS_IMPLEMENTATION_MAP.has(name);
}



let TAG_COUNT = {}
/**
 * Naive unique IDs for components.
 * Enumerates component by name
 */
module.exports.enumerateTags = function setTagId (tag) {
  if (tag.id === void 0) {
    TAG_COUNT [tag.name] = (TAG_COUNT [tag.name] || 0) + 1
    tag.id = tag.name + TAG_COUNT [tag.name]
  }
}

/**
 * Take request url and return a file system path of the page
 */
function resolvePath(dirname, path) {
  
  const fs = require('fs')

  const fullPath = (dirname + '/pages/' + path )
    .replace(/\/\//g, '/').replace(/\/$/, '')
  
  try {
    
    try {
      if (fs.statSync(fullPath + '.riot').isFile())
        return fullPath + '.riot';
    }
    catch (e) { }

    if (fs.statSync(fullPath + '/index.riot').isFile())
      return fullPath + '/index.riot';

  } catch (e) {
    return false;
  }

}
module.exports.resolvePath =  resolvePath



