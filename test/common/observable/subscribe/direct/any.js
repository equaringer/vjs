'use strict'
/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count

describe('subscribing to any field, toplevel', function () {
  var obs = new Observable({
    one: {},
    two: {},
    three: {}
  })

  beforeEach(function () {
    count = 0
  })

  it('should fire once for all fields', function () {
    obs.subscribe({
      $any: true
    }, function (data) {
      count++
    }).run()

    expect(count).equals(3)
  })

  it('changing existing field fires subscription', function(){
    obs.set({
      one: 1
    })
    expect(count).equals(1)
  })

  it('adding a field fires subscription', function(){
    obs.set({
      randomField: {
        nested: true
      }
    })
    expect(count).equals(1)
  })

  it('adding field with a value fires subscription', function(){
    obs.set({
      randomField3: true
    })
    expect(count).equals(1)
  })
})

describe('subscribing to any field, nested', function () {
  var obs = new Observable({
    nested: {
      one: {},
      two: {},
      three: {}
    }
  })

  beforeEach(function () {
    count = 0
  })

  it('should fire once for all fields', function () {
    obs.subscribe({
      nested: {
        $any: true
      }
    }, function (data) {
      count++
    }).run()

    expect(count).equals(3)
  })

  it('changing existing field fires subscription', function(){
    obs.nested.set({
      one: 1
    })
    expect(count).equals(1)
  })

  it('adding a field fires subscription', function(){
    obs.nested.set({
      randomField: {
        nested: true
      }
    })
    expect(count).equals(1)
  })

  it('adding field with a value fires subscription', function(){
    obs.nested.set({
      randomField3: true
    })
    expect(count).equals(1)
  })
})
