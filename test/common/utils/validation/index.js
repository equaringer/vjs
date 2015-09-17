/* global describe, it, expect, sinon */

var Observable = require('../../../../lib/observable/')
var validate = require('../../../../lib/util/validate')
var isString = require('../../../../lib/util/validate/isString')
var isColor = require('../../../../lib/util/validate/isColor')
var isOneOf = require('../../../../lib/util/validate/isOneOf')

var defaultColor = '#654321'
var defaultDisplay = 'block'

var validates = new Observable({
  background: {
    $key: 'background',
    color: {
      $key: 'color',
      $val: defaultColor,
      $on: {
        $change: {
          $trigger: validate([isString, isColor])
        }
      }
    }
  },
  display: {
    $key: 'display',
    $val: defaultDisplay,
    $on: {
      $change: {
        $trigger: validate([
          isString,
          isOneOf([
            'block',
            'none'
          ])
        ])
      }
    }
  }
})

var validColor = '#123456'
var validDisplay = 'top'
var invalidColor = 'poop-color'
var invalidDisplay = 'out-of-sight'

describe('validate', function () {
  it('should have defaults'
  , function () {
    expect(validates.background.color.$val).to.equal(defaultColor)
    expect(validates.display.$val).to.equal(defaultDisplay)
  })

  it('should emit an error when an invalid value is set'
  , function (done) {
    var spy = sinon.spy()
    validates.on('$error', function (err) {
      console.log('Error', err)
      expect(err).to.an.error
      sinon.assert.notCalled(spy) // TODO Where sould this line go?
      done()
    })
    validates.on('$change', spy)
    validates.background.color.$val = invalidColor
  })

  it('should emit an array of errors when mutiple invalid values are set'
  , function (done) {
    var spy = sinon.spy()
    validates.on('$error', function (arr) {
      expect(arr).to.an.array
      var l = arr.length
      for (var i = 0; i < l; i += 1) {
        console.log('Error', arr[i])
        expect(arr[i]).to.be.an.error
      }
      sinon.assert.notCalled(spy) // TODO Where sould this line go?
      done()
    })
    validates.on('$change', spy)
    validates.set({
      background: {
        color: invalidColor
      },
      display: invalidDisplay
    })
  })

  it('should emit a `change` event when all provided values are valid'
  , function (done) {
    var spy = sinon.spy()
    validates.on('$error', spy)
    validates.on('$change', function () {
      expect(this.background.color.$val).to.equal(validColor)
      expect(this.display.$val).to.equal(validDisplay)
      sinon.assert.notCalled(spy) // TODO Where sould this line go?
      done()
    })
    validates.set({
      background: {
        color: validColor
      },
      display: validDisplay
    })
  })
})
