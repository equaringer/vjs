var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')


// behaves correctly except for remove and parent

// parent and error emitter are still weird

xit('should fire all tracking info from array', function (done) {
  var example = ['new', 'remove', 'parent', 'click']
  var a = new Observable({
    b: {
      inject: tracking,
      on: {
        data: function (event, meta) {}
      },
      track: example
    }
  })

  var cnt = 0
  trackerEmitter.services.test = function (obj) {
    cnt++
    if (cnt === example.length) {
      expect(cnt).to.equal(4)
      done()
    }
    if(cnt===3) {
      a.remove()
    }
  }
  for (var i = 0; i < example.length; i++) {
    if (example[i] !== 'remove') {
      a.b.emit(example[i])
    }
  }
})