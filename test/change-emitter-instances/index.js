//this can become something like gaston-testor what ever to make it clear that it comes from gaston
require('tester')

describe('$change emitter - instances', function() {

  var Observable = require('../../lib/observable')
  var measure = {
    a:{},
    b:{}
  }
  var a
  var b
  var c

  it( 'create new observable (a), add $change listener', function() {    
    measure.a.val = { total: 0 }

    a = new Observable({
      $key:'a',
      $on: {
        $change: function( event, meta ) {
          var keyCnt =  measure.a.val[this._$key] 
          measure.a.val.total+=1
          measure.a.val[this._$key] = keyCnt ? (keyCnt+1) : 1 
        }
      }
    })
    expect( measure.a.val.total ).to.equal( 0 )

    a.$val = 'a value'
    expect( measure.a.val.a ).to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 1 )
  })

  it( 'create new a.$Constructor (b)', function() {
    b = new a.$Constructor({
      $key:'b'
    })  
    expect( a.$on._instances.length )
      .msg('a.$on._instances has correct length').to.equal(1)
    expect( a.$on._instances[0] )
      .msg('b is a.$on._instances.total').to.equal(b)

    expect( measure.a.val.b ).to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 2 )
  })

  it( 'change a.$val', function() {
    a.$val = 'a change'
    expect( measure.a.val.a ).msg('a context').to.equal( 2 )
    expect( measure.a.val.b ).msg('b context').to.equal( 2 )
    expect( measure.a.val.total ).to.equal( 4 )
  })

  it( 'create new b.$Constructor (c)', function() {
    c = new b.$Constructor({
      $key:'c'
    }) 
    expect( measure.a.val.a ).msg('a context').to.equal( 2 )
    expect( measure.a.val.b ).msg('b context').to.equal( 2 )
    expect( measure.a.val.c ).msg('c context').to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 5 )
  })

  it( 'change a.$val', function() {
    a.$val = 'a changes again'
    expect( measure.a.val.a ).msg('a context').to.equal( 3 )
    expect( measure.a.val.b ).msg('b context').to.equal( 3 )
    expect( measure.a.val.c ).msg('c context').to.equal( 2 )
    expect( measure.a.val.total ).to.equal( 8 )
  })

  it( 'change b, add an extra property', function() {
    b.$val = {
      extraProperty:true
    } 
    //no update on a (since its out of the context of a)
    expect( measure.a.val.a ).msg('a context').to.equal( 3 )
    expect( measure.a.val.b ).msg('b context').to.equal( 4 )
    expect( measure.a.val.c ).msg('c context').to.equal( 3 )
    expect( measure.a.val.total ).to.equal( 10 )
  })

  it( 'add and extra change listener on b (bListener)', function() {

    console.clear()

    measure.b.second = { total: 0 }
    b.$val = {
      $on: {
        $change: {
          second: function() {
            var keyCnt =  measure.b.second[this._$key] 
            measure.b.second.total+=1
            measure.b.second[this._$key] = keyCnt ? (keyCnt+1) : 1 
          }
        }
      }
    } 

    //no update on a (since its out of the context of a)
    expect( measure.a.val.a ).msg('a context').to.equal( 3 )
    //updates since it has to create its own property .$on for b (and c)
    expect( measure.a.val.b ).msg('b context').to.equal( 5 )

    //because i changed b's change listener this is broken...

    //must be a problem in $onFn
    expect( measure.a.val.c ).msg('c context').to.equal( 4 )

    expect( measure.a.val.total ).to.equal( 12 )
  })

})

