//** RiotJS plugins that supposed to work the same way on client and server */
const riot = require('riot')
const client = require('client')

const CilentPlugin = (instance) => {
  Object.defineProperty(instance, 'client', {
    get: function() {
      return client.factory(this.req)
    }.bind(instance)
  })
};

riot.install(CilentPlugin)