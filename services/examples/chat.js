
const messages = [];
/**
 * @param {{from: String, message: String}} message - add message to stack
 * */
function addMessage(message) {
  messages.push(message);
  if (messages.length > 25) {
    messages.unshift();
  }
}

module.exports = (app) => {
  app.use('chat/example', {

    // get messages
    async find() {
      return messages;
    },

    // enter chat with nickname
    async get(nickname, params) {
      const username = nickname + Math.round(Math.random() * 250);
      params.request.session['nickname'] = username;
      params.request.session.save();
      return Promise.resolve({nickname: username});
    },

    // send a status message
    async patch(status, data, params) {
      return {
        nickname: params.request.session['nickname'],
        status,
      };
    },

    // send a message to chat
    async create(data, params) {
      const msg = {
        from: params.request.session['nickname'],
        message: data.message,
      };
      addMessage(msg);
      return msg;
    },

  });

  app.on('connection', (connection) => {
    app.channel('chat/example').join(connection);
  });

  app.service('chat/example').publish('created', (data, context) => {
    return [app.channel('chat/example')];
  });
  app.service('chat/example').publish('patched', (data, context) => {
    return [app.channel('chat/example')];
  });
};
