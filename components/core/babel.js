const {addHook} = require('pirates')
const {transform} = require('@babel/core')
const {compile} = require('@riotjs/compiler')

module.exports = (options) => addHook(
  function(source, filename) {
    let code = filename.endsWith('.riot') ? compile(source, { file: filename }).code : source;
    return transform(code, {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'cjs',
            targets: {
              node: process.versions.node
            }
          }
        ]
      ]
    }).code
  },
  {
    exts: ['.js', '.riot'],
    ignoreNodeModules: true,
    ...options
  }
)