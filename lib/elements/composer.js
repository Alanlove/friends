module.exports = Composer

var h = require('virtual-dom/h')
var inherits = require('util').inherits
var BaseElement = require('./base-element')

function Composer (target) {
  BaseElement.call(this, target)
  // List of words available to autocomplete
  this.autocompletes = []
  // Whether we should show the autocomplete box
  this.autocompleting = false
}
inherits(Composer, BaseElement)

Composer.prototype.render = function () {
  var self = this

  var input = h('input', {
    placeholder: 'Send a message...',
    autofocus: true,
    onkeydown: function (e) {
      if (e.keyCode === 9 && self.autocompleting !== false) {
        e.preventDefault()
        this.value = this.value + self.autocompleting
        self.autocompleting = false
      }
    },
    onkeyup: function (e) {
      self.autocomplete(this.value)
    }
  })

  return h('form.composer', {
    onsubmit: function (e) {
      e.preventDefault()
      var input = this.querySelector('input')
      self.send('sendMessage', input.value)
      input.value = ''
    }
  }, input)
}

Composer.prototype.autocomplete = function (text) {
  if (!text || text.length < 1) {
    this.autocompleting = false
    return
  }
  for (var i = 0; i < this.autocompletes.length; i++) {
    var val = this.autocompletes[i]
    if (val.indexOf(text) !== -1) {
      if (this.autocompletes[i] === text) this.autocompleting = false
      else this.autocompleting = this.autocompletes[i].slice(text.length) + ': '
      return
    }
  }
  this.autocompleting = false
}
