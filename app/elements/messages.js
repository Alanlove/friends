module.exports = Messages

var h = require('virtual-dom/h')

function Messages (app) {
  this.app = app
}

Messages.prototype.render = function (messages) {
  if (messages.length === 0) {
    var starterMessage = 'This is new channel. Send a message to start things off!'
    return h('.messages.starterMessage', this, starterMessage)
  }

  messages = messages.map(function (msg) {
    return h('.message.clearfix', [
      h('img.avatar', { src: msg.avatar }),
      h('.username', msg.username),
      h('.timestamp', String(msg.timestamp)),
      h('.text', msg.text)
    ])
  })
  return h('.messages', messages)
}
