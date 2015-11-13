exports.define = {
  _setObj: {
    get: function getSetObj () {
      return this.convert({
        exclude: excludeKeys
      })
    }
  }
}

function excludeKeys (val, key) {
  if(typeof val === 'object' && val._properties)
   return val._properties[key]
  else
    return true
}
