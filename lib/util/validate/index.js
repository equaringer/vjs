module.exports = exports = function (validators) {
  return function (resolve, event) {
    if (typeof validators === 'function' && validators.call(this, event)) {
      resolve()
    } else if (validators instanceof Array) {
      var l = validators.length
      for (var i = 0, valid = true; i < l && valid; i += 1) {
        valid = validators[i].call(this, event)
      }
      if (valid) {
        resolve()
      }
    }
  }
}
