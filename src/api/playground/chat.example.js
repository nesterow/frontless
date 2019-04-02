
const messages = [
];
/**
 * @param {{from: String, message: String}} message - add message to stack
 * */
function addMessage(message) {
  messages.push(message);
  if (messages.length > 25) {
    messages.unshift();
  }
}

export default (app) => {
  app.use('playground/messages', {

    // get messages
    async find() {
      return messages;
    },

    // enter chat with nickname
    async get(nickname, params) {
      params.request.session['nickname'] = nickname;
      params.request.session.save();
      return Promise.resolve({});
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
    app.channel('playground/messages').join(connection);
  });

  app.service('playground/messages').publish('created', (data, context) => {
    return [app.channel('playground/messages')];
  });
  app.service('playground/messages').publish('patched', (data, context) => {
    return [app.channel('playground/messages')];
  });

};
