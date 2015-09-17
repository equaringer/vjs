module.exports = exports = function (validValues) {
  return function (event) {
    if (validValues.indexOf(this.$val) !== -1) {
      return true
    } else {
      var error = new Error('Invalid Value')
      error.info = this.$key + ' should be one of ' + validValues.join(', ')
      this.emit('$error', event, error)
      return false
    }
  }
}
