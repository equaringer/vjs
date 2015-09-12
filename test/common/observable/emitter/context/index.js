console.clear()

describe('context', function() {

  var Observable = require( '../../../../../lib/observable' )
  var Event = require( '../../../../../lib/event' ).prototype
      .inject( require('../../../../../lib/event/toString.js') )

  function contextObservable() {
    var cnt = {
      total: 0
    }
    var a = new Observable({
      $key:'a',
      $trackInstances: true,
      b: {
        $on: {
          $change:function( event ) {
            // console.group()
            console.log('%clistener fires:', 'color:green',this.$path && this.$path.join('.'), event.$stamp)
            // console.groupEnd()
            var key = this.$path[0]
            cnt[key] = cnt[key] ? cnt[key]+1 : 1
            cnt.total++
          }
        }
      }
    })
    var aInstance = new a.$Constructor({
      $key:'aInstance'
    })
    return {
      cnt: cnt,
      a: a,
      aInstance: aInstance
    }
  }

  describe( 'deep resolve test', function() {
    var test = contextObservable()
    it( 'should fire once for "blurf"' , function() {
      test.blurf = new test.a.$Constructor({
        $key:'blurf',
        b: {
          hello: {
            a: true,
            b: true
          }
        }
      })
      expect( test.cnt.total ).to.equal( 1 )
      expect( test.cnt.blurf ).to.equal( 1 )
    })

    it.skip( 'should fire zero times for "blurf1", should not resolve context' , function() {
      test.blurf1 = new test.blurf.$Constructor({
        $key:'blurf1',
        b: {
          //do not resolve context is the same
          hello: {
            a: true,
            b: true
          }
        }
      })
      expect( test.blurf1.b ).to.equal( test.blurf.b )
      expect( test.cnt.total ).to.equal( 1 )
    })

    it( 'should fire once for "blurf2"' , function() {
      test.blurf2 = new test.blurf.$Constructor({
        $key:'blurf2',
        b: {
          mur: true,
          hello: {
            a: true,
            b: true
          }
        }
      })
      expect( test.cnt.blurf2 ).to.equal( 1 )
    })
  })

  describe( 'emit on instance', function() {
      var test = contextObservable()
      //dit is resolve context shit
      // console.log('????')
      test.aInstance.b.emit('$change') // = 'b change'
      // console.log('????2')

      it( 'should fire once for "aInstance" context' , function() {
        expect( test.cnt.aInstance ).to.equal( 1 )
      })
      it( 'should fire once in total' , function() {
        expect( test.cnt.total ).to.equal( 1 )
      })

  })

  describe( 'set on instance', function() {
    var test = contextObservable()
    //dit is resolve context shit
    test.aInstance.b.$val = 'b change'
    it( 'should fire once for "aInstance" context' , function() {
      expect( test.cnt.aInstance ).to.equal( 1 )
    })
    it( 'should fire once in total' , function() {
      expect( test.cnt.total ).to.equal( 1 )
    })
  })

  describe( 'multiple instances', function() {
    var test = contextObservable()

    var c = new test.a.$Constructor({
      $key:'c'
    })

    // before(function() {
    test.a.b.$val = 'a change'
    // })

    it( 'should fire once for "a" context' , function() {
      expect( test.cnt.a ).to.equal( 1 )
    })
    it( 'should fire once for "aInstance" context' , function() {
      expect( test.cnt.aInstance ).to.equal( 1 )
    })
    it( 'should fire once for "c" context' , function() {
      expect( test.cnt.c ).to.equal( 1 )
    })
    it( 'should fire 3 times in total' , function() {
      expect( test.cnt.total ).to.equal( 3 )
    })
  })

  describe( 'multiple contexts and instances', function() {
    var test = contextObservable()

    test.c = new test.a.$Constructor({
      $key:'c'
    })
    test.d = new test.a.$Constructor({
      $key:'d'
    })

    it( 'creates "e" sets b and should fire once for "e" instance' , function() {
      test.e  = new test.a.$Constructor({
        $key: 'e',
        b:'b' //you should not fire for original!
        //different field name makes it extra hard
      })
      expect( test.cnt.e ).to.equal( 1 )
    })

    it( 'sets a.b and should fire once for "a"' , function() {
      test.a.b.$val = 'a'
      expect( test.cnt.a ).to.equal( 1 )
    })

    it( 'should fire once for "c"' , function() {
      //problem -- has instances never update contexts anymore
      expect( test.cnt.c ).to.equal( 1 )
    })

    it( 'should fire once for "d"' , function() {
      //problem -- has instances never update contexts anymore
      expect( test.cnt.d ).to.equal( 1 )
    })

    it( 'should fire once for "aInstance"' , function() {
      //problem -- has instances never update contexts anymore
      expect( test.cnt.aInstance ).to.equal( 1 )
    })

    xit( 'should not fire for "e"' , function() {
      //TOOD: disconnected cactch irrelevant change
      //now update for update on val a (althgouht its not shared)
      expect( test.cnt.e ).to.equal( 1 )
    })

  })

  describe( 'instance with a different parent', function() {
    var test = contextObservable()

    it( 'creates a new a.b (c) should fire once for c', function() {
      test.c = new test.a.b.$Constructor({
        $key:'c'
      })
      expect( test.cnt.c ).to.equal( 1 )
    })

    it( 'sets a.b, should fire once for "a"' , function() {
      //how about c?
      test.a.b.$val = 'a change'
      expect( test.cnt.a ).to.equal( 1 )
    })

    it( 'should fire once for "aInstance"' , function() {
      //fire one too many for test.c (does context twice?)
      expect( test.cnt.aInstance ).to.equal( 1 )
    })

    it( 'should fire once for "c"' , function() {
      expect( test.cnt.c ).to.equal( 2 )
    })

    it( 'should fire 4 times in total' , function() {
      expect( test.cnt.total ).to.equal( 4 )
    })
  })

  describe( 'different instances, different contexts', function() {
    var test = contextObservable()

    it('creates a new "a.b" --> "c" should fire once for "c"', function() {
      // console.clear()
      test.c = new test.a.b.$Constructor({
        $key:'c'
      })
      expect( test.cnt.a ).msg('no update on a').to.be.not.ok
      expect( test.cnt.c ).msg('c').to.equal( 1 )
      expect( test.cnt.total ).msg('total').to.equal( 1 )
    })

    it( 'creates a new "a" --> "d" (nest observable) should not fire', function() {
      // console.clear()
      test.d = new Observable({
        $key:'d',
        nest: { $useVal: new test.a.$Constructor() }
        //ultra mested up case...
      })

      expect( test.cnt.a ).msg('no update on a').to.be.not.ok
      expect( test.cnt.c ).msg('c').to.equal( 1 )
      expect( test.cnt.total ).msg('total').to.equal( 1 )
    })

    it( 'sets a, should fire for c, a, aIsntance, d', function() {
      test.a.b.$val = 'marcus'
      expect( test.cnt.a ).msg('a').to.equal( 1 )
      expect( test.cnt.aInstance ).msg('aInstance').to.equal( 1 )
      expect( test.cnt.d ).msg('d').to.equal( 1 )
      expect( test.cnt.c ).msg('c').to.equal( 2 )
      expect( test.cnt.total ).msg('total').to.equal( 5 )
    })
    //now do stuff with d
  })

  describe( 'contexts to instances updates', function() {
    var test = contextObservable()
    //hard need to get rid of _$context in instances
    it( 'creates a new "a" --> "c" (nest observable) should not fire', function() {
      test.c = new Observable({
        $key:'c',
        $trackInstances: true,
        // nest: { $useVal: new test.a.$Constructor() }
        //this has to resolve context as well!
        //check for if it has a contructor
      })

      var Constructor = test.c.$Constructor

      test.c.set({
        nest: { $useVal: new test.a.$Constructor() }
      })

      expect( test.cnt.a ).msg('no update on a').to.be.not.ok
      expect( test.cnt.total ).msg('total').to.equal( 0 )
    })

    it( 'creates new instances of "c" --> "d" and "e", should not fire', function() {
      test.d = new test.c.$Constructor({
        $key:'d'
      })

      test.e = new test.c.$Constructor({
        $key:'e'
      })

      expect( test.cnt.a ).msg('no update on a').to.be.not.ok
      expect( test.cnt.total ).msg('total').to.equal( 0 )
    })

    it( 'fires from context in c', function() {
      expect( test.cnt.total ).msg('total').to.equal( 0 )
      //.b is trough the context of c.nest which is a seperate instance
      test.c.nest.b.emit('$change')
      // test.c.nest.b.$val = 'something'  <--- also this goes wrong
      expect( test.cnt.total ).msg('total').to.equal( 3 )
      expect( test.cnt.d ).msg('d').to.equal( 1 )
      expect( test.cnt.e ).msg('e').to.equal( 1 )
      expect( test.cnt.c ).msg('c').to.equal( 1 )
      expect( test.cnt.a ).msg('no update on a').to.be.not.ok
    })

    it( 'fires from context in c (second time)', function() {
      //.b is trough the context of c.nest which is a seperate instance
      test.c.nest.b.emit('$change')
      // test.c.nest.b.$val = 'something'  <--- also this goes wrong
      expect( test.cnt.total ).msg('total').to.equal( 6 )
      expect( test.cnt.d ).msg('d').to.equal( 2 )
      expect( test.cnt.e ).msg('e').to.equal( 2 )
      expect( test.cnt.c ).msg('c').to.equal( 2 )
      expect( test.cnt.a ).msg('no update on a').to.be.not.ok
    })

    it( 'fires from resolved a.b in c', function() {
      console.clear()
      console.error('-------------------')
      //first of all wtf doesnt the orig fire???
      // console.log(test.c.nest === )
      //hard part now -- thiung that goes wrong--> nest is not a real field for 2 instances
      // test.c.nest.b.$val = 'something'
      //what goes wrong?
      //contexts gets resolved --- >
      test.c.nest.set({
        b:'something'
      })
      //resolving breaks??? wtf
      expect( test.cnt.c ).msg('c').to.equal( 3 )
      //only updating d????
      //the weirdest move -- tmrw check this out completely
      expect( test.cnt.d ).msg('d').to.equal( 3 )
      expect( test.cnt.e ).msg('e').to.equal( 3 )
      expect( test.cnt.total ).msg('total').to.equal( 9 )
      expect( test.cnt.a ).msg('no update on a').to.be.not.ok
    })

  })

  describe('Update on instance that has an instance, in a nested field', function() {


    var a, a1, a2
    var measure = {}

    it('should call change function the correct amount of times', function() {
      a = new Observable({
        $key: 'a',
        $trackInstances: true,
        c: {
          $on: {
            $change:function(event) {
              console.log('%clistener fires:', 'color:green',this.$path && this.$path.join('.'), event.$stamp)
              var cnt = measure[ this.$path[0]]
              measure[ this.$path[0]] = cnt ? cnt+1 : 1
            }
          }
        }
      })

      a1 = new a.$Constructor({
        $key: 'a1'
      })

      a2 = new a1.$Constructor({
        $key:'a2'
      })

      console.clear()

      a1.c.$val = 'xxx'

      expect( measure.a2 ).msg('a2').to.equal(1)
      expect( measure.a1 ).msg('a1').to.equal(1)
      expect( measure.a ).msg( 'a' ).to.be.not.ok
    })
  })

  describe('Update on instance that has an instance, in a nested field deep', function() {

    console.clear()

    var a, a1, a2
    var measure = {}

    it('should call change function the correct amount of times', function() {
      a = new Observable({
        $key: 'a',
        $trackInstances: true,
        c: {
          d: {
            e: {
              $on: {
                $change:function(event) {
                  console.log('%clistener fires:', 'color:green',this.$path && this.$path.join('.'), event.$stamp)
                  var cnt = measure[ this.$path[0]]
                  measure[ this.$path[0]] = cnt ? cnt+1 : 1
                }
              }
            }
          }
        }
      })

      a1 = new a.$Constructor({
        $key: 'a1'
      })

      a2 = new a1.$Constructor({
        $key:'a2'
      })

      expect( measure.a2 ).msg('a2').to.be.not.ok

      a1.c.d.e.$val = 'xxx'
      expect( measure.a1 ).msg('a1').to.equal(1)
      expect( measure.a ).msg( 'a' ).to.be.not.ok
      expect( measure.a2 ).msg('a2').to.equal(1)

    })
  })

  //now the test for custom emits (hard case -- sets are relativly easy)
  //for this you need to do emits to contexts to contexts -- really strange
  //within my context search for instance but not if im emitted from context
  //maybe add a thing for that?

})
