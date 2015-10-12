describe('object operations', function () {
  var Observable = require('../../../../lib/observable')

  describe('add', function () {
    var a
    it('create a new observable, should return a cache object', function () {
      a = new Observable({
        inject: require('../../../../lib/operator/all'),
        key: 'a',
        b: 'its b',
        // merge er ook bij
        $add: function () {
          return { c: 'its c' }
        }
      })
      expect(a.val).equals(a._cache)
    })

    it('should have field a.b', function () {
      expect(a.val.b._input).equals(a.b)
    })

    it('should have field a.b.c', function () {
      expect(a.val).has.property('c')
        .which.has.property('_input')
        .which.equals('its c')
    })
  })

  describe('transform', function () {
    var a
    arr = []
    it('create a new observable, should return a cache object', function () {
      a = new Observable({
        inject: [
          require('../../../../lib/operator/all'),
          require('../../../../lib/methods/map')
        ],
        key: 'a',
        b: 'its b',
        c: 'its c',
        $transform: function () {
          return this.map((property, key) => { return { wow: property } })
        }
      })
      expect(a.val).equals(a._cache)
    })

    it('should have all fields', function () {
      var arr = []
      a.val.each((property, key) => {
        arr.push(property.wow._input)
      })
      expect(arr).to.deep.equal([a.b, a.c])
    })
  })
})