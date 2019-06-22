const renderAsync = require('./render')
const utils = require('.')


/**
 * Render pages by resolving from path
 * - omits `json` requests
 * 
 */
module.exports = (dirname, sharedAttributes = [], pluginOpts = {}) => async (req, res, next) => {
  
  const ejs = require('ejs')
  const {resolvePath, parseArgs} = utils;

  req._res = res;
  if (req.headers.accept &&
      req.headers.accept.includes('/json')) {
    return next();
  }

  try {
    req.params.args = parseArgs(req.params.args)
    const path = resolvePath(pluginOpts.__dirname || dirname, req.params [0])
    const component = require((path || dirname + '/pages/errors/404.riot')).default
    const {output, state, shared, layout, head, stylesheet, Global} = await renderAsync('section', component, { req, res, next, }, sharedAttributes)
    
    ejs.renderFile(pluginOpts.layoutPath || (dirname + `/pages/layout/${layout}.ejs`), {req, output, state, shared, head, stylesheet, Global}, null, function(err, data) {
      if (err) {
        return res.status(500).end(err)
      }
      res.status(path ? 200 : 404).end(data)
    })
  } catch(e) {

    const error = require(dirname + ('/pages/errors/400.riot')).default
    console.log(e)
    const {output, state, layout, shared, head, stylesheet, Global} = await renderAsync('section', error, { req, stack: (e.stack || e.message) }, sharedAttributes);
    ejs.renderFile(dirname + `/pages/layout/${layout}.ejs`, {req, output, state, shared, head, stylesheet, Global}, null, function(err, data) {
      if (err) {
        return res.status(500).end(err)
      }
      res.status(400).end(data)
    })
  }
}
