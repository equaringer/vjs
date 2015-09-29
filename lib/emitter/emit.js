'use strict'
var Event = require('../event')

module.exports = function (emitter) {
  var Emitter = emitter.Constructor

  emitter.properties = {
    triggerEvent: { val: true },
    meta: true
  }

  emitter.define({
    getTriggerEvent: function (key) {
      return this.triggerEvent
    },
    emit: function (event, meta, bind, key, ignore) {
      // do last stamp check hier saves calls
      var trigger

      if (event === false) {
        return
      }

      if (event === void 0) {
        if (ignore) {
          return
        }
        if (!key) {
          key = this.key
        }
        event = new Event(this, key)
        trigger = true
      }
      // this become a lot cleaner
      // && this._properties && this._properties.meta
      // needs instanceof check not has this.push
      // this has to become a lot better!
      if (this.meta === void 0 && meta !== void 0 && this instanceof Emitter) {
        this.meta = meta
      }
      if (
        !event.isTriggered &&
        (trigger ||
        event.origin === this &&
        event.type === key &&
        // JSstandard: want to use type coercion check here
        event.context == this._context)
      ) {
        if (this.getTriggerEvent(key)) {
          trigger = event.isTriggered = true
        }
      }
      if (this.emitInternal(event, bind, meta, key, trigger, ignore)) {
        event.trigger()
      }
      return this
    },
    emitInternal: function (event, bind, meta, key, trigger, ignore) {
      this.push(bind, event.push(this))
      return trigger
    }
  })
}