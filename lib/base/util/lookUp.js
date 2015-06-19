"use strict";

var helpers = require('./helpers')
var isPlainObj = helpers.isPlainObj
var getPath = helpers.getPath
var returnOptions = helpers.returnOptions
var returnPath = helpers.returnPath

/**
 * @function $lookUp
 * @memberOf Base#
 * @param  {string|string[]} path Path or field to find in parent tree
 * @param  {*} [options] {regexp} Results will be tested using rexexp
 * <br>{base|string|boolean} Use options to compare with results
 * <br>{function} Call for each result, with result as param
 * <br>{object} Can contain the following:
 * @param  {object} options.conditions Results will be tested by these conditions
 * @return {object} result
 */
module.exports = function(path, options) {
  var parent = this.$parent
  var conditions

  if (parent) {
    if(options !== void 0 && isPlainObj(options)){
      options = returnOptions(options)
    }
    path = returnPath( path )
    return lookUpParent(parent, path, path.length, options)
  }
}

function lookUpParent( parent, path, length, test ) {
  return getPath( parent, path, length, test)
    || ( parent = parent.$parent ) 
      && lookUpParent(parent, path, length, test )
}