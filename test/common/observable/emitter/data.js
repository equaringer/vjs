'use strict'
describe('data-argument', function () {
  var Observable = require('../../../../lib/observable')
  describe('instances', function () {
    var lastData
    var nestedlastData
    beforeEach(function () {
      nestedlastData = void 0
      lastData = void 0
    })
    var a = new Observable({
      key: 'a',
      on: {
        data (data) {
          console.log('datax!', this.path, data)
          lastData = data
        }
      },
      nested2: {
        on: {
          data (data) {
            nestedlastData = data
            console.log('number 2!', data)
          }
        }
      },
      nested: {
        on: {
          data (data) {
            console.log('datax!2222', this.path, data)
            nestedlastData = data
          }
        }
      }
    })
    var b
    it('data should be a setobj', function () {
      b = new a.Constructor({
        key: 'b'
      })
      expect(lastData).to.deep.equal({ key: 'b' })
    })

    it('set b-nested2', function () {
      b.set({ nested2: 'b' }) // should fire on on nested as well!
      expect(nestedlastData).to.equal('b')
    })

    it('remove b-nested2', function () {
      b.nested2.remove()
      expect(nestedlastData).to.equal(null)
    })

    it('remove b-nested using set object', function () {
      console.clear()
      // instance allready removed or somethig?
      // b.nested.remove()
      b.set({ nested: null }) // should fire on on nested as well!
      expect(nestedlastData).to.equal(null)
    })
    xit('remove b', function () {
      b.remove()
      expect(lastData).to.equal(null)
    })
  })
})
