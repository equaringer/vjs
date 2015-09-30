describe('single instance', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var a = new Observable({
      on: {
        data: {
          condition: function (done, event) {
            setTimeout(done, 1000)
          },
          val: function () {
            done()
          }
        }
      }
    })
    a.val = 'a change!'
  })
})

/*
  condition uses parseValue
  hands in the this to parseValue and continiues from there
  -- preferbly the this .input
  -- condition is responsible for setting .output
*/

/*
 setup of condition on emit instead of trigger
 makes it easier to get different inputs per condition
 condition can be called within instances (contexts are not important!)
 so condition is more of a thing in emitter.push ???? insteas of trigger
 what about instances that have litterly no difference?

  make bind work for this (bind is nice if it works a bit better)
  operators -- need to exclude input in parseValue
  batch option
  operators --- operators are a bit different the don work on the ouput
  make this an option as well (ignore input/ouput)
  bind for emitter, en parse functies
*/
