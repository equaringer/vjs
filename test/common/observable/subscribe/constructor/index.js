var Observable = require('../../../../../lib/observable')
var SubsEmitter = require('../../../../../lib/observable/subscribe/constructor')
var On = require('../../../../../lib/observable/on/constructor')

describe('multiple instances', function () {
  On.prototype.set({
    flags: {
      spesh: new SubsEmitter({
        key: 'spesh',
        pattern: {
          randomField: true
        }
      })
    }
  })

  var a = new Observable({
    key: 'a'
  })

  it('expect property listener to be added to a', function () {
    a.set({
      on: {
        spesh: function () {}
      }
    })
    expect(a.on.property).ok
  })

})
