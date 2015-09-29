'use strict'
var Base = require('../base/')

module.exports = new Base({
  app: 'my app id',
  id: 'event',
  eventobject: {
    eventType: '',
    stamp: '',
    eventOriginator: ''
  }
}).Constructor

/*
args: {
  key: $error/$value/$change etc,
  ID: ID,
  payload: {
    value: true/false,
    errormessage: errormessage,
    eventobject: {
      changeid: originator event
    }
  }
}
*/
// path originaro
// path event
//

// plugin voor de emitter is iets war args moet consumen (b.v google analytics plugin > bv event key > ID > payload (value > true false errormessage > eventobject zoals change id en dit is de originaro van het event))
// plugin eerste logger > in de console.log mn tracking info
// if key === error > parse error object
// handle keys ----
// do special for error