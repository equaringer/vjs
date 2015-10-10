describe('base', function () {
  var Base = require('../../../../lib/observable')
  var a

  var f = () => console.log('x?')
  var restargs = function (a, b, ...args) {
    console.log(args)
  }

  restargs(1,2, 132, 123)

  var obj = {
    ['xxxx' + 1]: 123132,
    a: true
  }
  var ac, bc
  [ac, bc] = [1, 2]
  //
  var xxx = `${ac} hello ${bc}`
  console.log(xxx)

  it('create a new base inject operators', function () {
    a = new Base({
      inject: require('../../../../lib/operator/all'),
      key: 'a',
      val: 'hello',
      $add: 'gurk'
    })
    expect(a.val).to.equal('hellogurk')
  })

  // still gets wrong order by defailt
  it('create a new base inject operators, check if order works', function () {
    a = new Base({
      inject: require('../../../../lib/operator/all'),
      key: 'a',
      val: 'no',
      $transform: function () {
        return 'hello'
      },
      $add: 'gurk'
      // now it takes the order of things in the operators thing -- however it should be set when you set the field
      // add order when setting a operator
    })
    // delete a._operators
    expect(a.val).to.equal('hellogurk')
  })
})

describe('observable', function () {
  var Observable = require('../../../../lib/observable')
  var a

  it('create a new base inject operators', function () {
    a = new Observable({
      inject: require('../../../../lib/operator/all'),
      key: 'a',
      val: 'hello',
      $add: 'gurk'
    })
    expect(a.val).to.equal('hellogurk')
  })
})
