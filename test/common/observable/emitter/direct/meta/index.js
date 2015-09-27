describe('meta', function () {
  var Observable = require('../../../../../../lib/observable')
  var a
  var measure = {}

  it('creates an observable, adds emitter types', function () {
    measure.a = {}
    a = new Observable({
      key: 'a',
      on: {
        change: function (event, meta) {
          console.log('fire change', meta)
          measure.a.change = meta
        },
        property: function (event, meta) {
          console.log('fire prop', meta)
          measure.a.property = meta
        }
      }
    })
  })

  it('property should not trigger events', function () {
    expect(a._on.property.triggerEvent).equals(false)
  })

  it('passes correct meta to change', function () {
    a.val = 'a'
    console.log(measure.a.change)
    expect(measure.a.change).equals('a')
  })

  it('passes correct meta to property', function () {
    a.set({ afield: true })
    console.log(measure.a.property)
    // expect(measure.a.property).equals('a')
  })

  it('change meta should be null when removed', function () {
    a.remove()
    expect(measure.a.change).equals(null)
  })
})
