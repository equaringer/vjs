module.exports = exports = function (event) {
  if (typeof this.$val === 'string') {
    return true
  } else {
    var error = new Error('Invalid Value')
    error.info = this.$key + ' should be a string'
    this.emit('$error', event, error)
    return false
  }
}
