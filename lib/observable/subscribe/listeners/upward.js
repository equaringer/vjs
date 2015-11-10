'use strict'
var incDepth = require('../current/inc/depth')
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    // do something with context resolvement
    // var resolver = {
    //   enpoint: this,
    //   map: mapvalue
    // }
    map[this.key] = mapvalue
    resolvePattern(this, map)
    emitter.subUp({}, event, this.parent, pattern, incDepth(current), map, {})
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    map[this.key] = mapvalue
    emitter.subUpRef({}, event, this.parent, pattern, incDepth(current), map, {}, context)
  }
}