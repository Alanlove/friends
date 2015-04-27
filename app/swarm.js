var events = require('events')
var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var levelup = require('levelup')
var memdown = require('memdown')
var hyperlog = require('hyperlog')
 
module.exports = createSwarm

function createSwarm () {
  var emitter = new events.EventEmitter()
  var db = levelup('friends', {db: memdown})
  var log = hyperlog(db)
 
  var hub = signalhub('http://dev.mathiasbuus.eu:8080', 'friends')
  var sw = swarm(hub)
  
  emitter.db = db
  emitter.log = log
  emitter.hub = hub
  emitter.swarm = sw
  
  emitter.send = function (message, cb) {
    log.heads(function (err, heads) {
      if (err) return cb(err)
      log.add(heads, JSON.stringify(message), cb)
    })
  }
 
  sw.on('peer', function (p, id) {
    console.log('peer', id)
    var stream = log.replicate({live: true})
    emitter.emit('peer', p, id, stream)
 
    stream.on('push', function () {
      console.log('pushing node')
    })
 
    stream.on('pull', function () {
      console.log('pulling node')
    })
 
    p.pipe(stream).pipe(p)
  })
  
  return emitter
}
