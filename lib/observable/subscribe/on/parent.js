'use strict'
var getPattern = require('../util/pattern')
module.exports = function onParent (data, event, emitter, pattern, info, mapValue, mapObj) {
  event.type = 'parent'
  mapObj[this.key] = mapValue
  pattern = getPattern(this, pattern, info, mapValue)
  emitter.subscribeField({}, event, this.parent, pattern, 'parent', info, mapObj)
}