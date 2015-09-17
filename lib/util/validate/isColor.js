module.exports = exports = function (event) {
  if (this.$val.match(/^#[0-9a-zA-Z]{6}$/)) {
    return true
  } else {
    var error = new Error('Invalid color')
    error.info = {
      observed: this.$val,
      expected: 'hex string i.e. `#rrggbb`'
    }
    this.emit('$error', event, error)
    return false
  }
}
