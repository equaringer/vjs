'use strict'
describe('flatten', function () {
  var flatten = require('../../../lib/util/flatten')
  var original = { a: { b: { c: { e: 1, f: 2, g: 3 } } } }
  it('should flatten'
    , function () {
      var expected = {
        'a.b.c.e': 1,
        'a.b.c.f': 2,
        'a.b.c.g': 3
      }
      var flattened = flatten(original)

      expect(flattened).to.deep.equal(expected)
    })

  it('should flatten accept an optional separator argument'
    , function () {
      var expected = {
        'a/b/c/e': 1,
        'a/b/c/f': 2,
        'a/b/c/g': 3
      }
      var flattened = flatten(original, '/')

      expect(flattened).to.deep.equal(expected)
    })
})
