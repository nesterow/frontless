module.exports = require(__dirname + '/**/*.riot', {mode: 'list'}).concat(
    require(__dirname + '/components/**/*.riot', {mode: 'list'})
)
