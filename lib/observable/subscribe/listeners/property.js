'use strict'
var resolvePattern = function () {}

var getDepth = require('../current/get/depth')
var getLevel = require('../current/get/level')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    console.log('property',data.added)

    var added = data.added
    if (added) {
      let found
      for (let i = added.length - 1; i >= 0; i--) {
        let key = added[i]
        let field = pattern[key]
        if (field) {
          if (!found) {
            // resolvePattern(this, mapvalue)
            found = true
          }
          map.parent = mapvalue
          emitter.subField(data, event, this[key], field, current, map)
        }
      }

      if (found) {
        // check if the listener can be removed
        // If all properties in the pattern have been found with no referenceDistance,
        // on the original subscriber
        let keepListener = pattern.each((property, key) => {
          if (!this[key]) {
            return true
          }
        })
        if (!keepListener) {
          let attach = this._on.property.attach
          attach.each(function (prop, key) {
            if (prop[1] === emitter) {
              attach.removeProperty(prop, key)
            }
          })
        }
      }
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    var added = data.added
    if (added) {
      let found
      for (let i = added.length - 1; i >= 0; i--) {
        let key = added[i]
        let field = pattern[key]
        if (field) {
          // can't resolve the pattern?
          map.parent = mapvalue
          emitter.subFieldRef(data, event, this[key], field, current, mapvalue, context)
          found = true
        }
      }

      if (found) {
        // check if the listener can be removed
        // If all properties in the pattern have been found on this referenceDistance or lower,
        // on the original subscriber
        let keepListener = pattern.each((property, key) => {
          if (!this[key]) {
            let value = property.val
            if (typeof value === 'object') {
              return keepPropertyListener(value, current)
            }
            if (value === true) {
              return true
            }
            // unify this with id check in  subField
            let prevDepth = getDepth(value)
            if (prevDepth) {
              let refDepth = getDepth(current)
              if (prevDepth > refDepth) {
                return true
              } else if (prevDepth === refDepth) {
                if (getLevel(value) > getLevel(current)) {
                  return true
                }
              }
            } else if (getLevel(value) > getLevel(current)) {
              return true
            }
          }
        })

        if (!keepListener) {
          let attach = this._on.property.attach
          attach.each(function (prop, key) {
            if (prop[1] === emitter) {
              attach.removeProperty(prop, key)
            }
          })
        }
      }
    }
  }
}

// unify this with keepRefListener
function keepPropertyListener (pattern, refinfo) {
  return pattern.each(function (property, key) {
    let value = property.val
    if (typeof value === 'object') {
      return keepPropertyListener(value, refinfo)
    }
    if (value === true) {
      return true
    }

    // unify this with id check in  subField
    let prevDepth = getDepth(value)
    if (prevDepth) {
      let refDepth = getDepth(refinfo)
      if (prevDepth > refDepth) {
        return true
      } else if (prevDepth === refDepth) {
        if (getLevel(value) > getLevel(refinfo)) {
          return true
        }
      }
    } else if (getLevel(value) > getLevel(refinfo)) {
      return true
    }
  })
}