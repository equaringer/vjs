"use strict";

var include = module.exports = function include(arr, thing) {
	if(thing instanceof Array)	{
		include.list(arr, thing)
	} else {
		include.item(arr, thing)
	}
}

include.list = function(arr, list) {
	var result
	for(var i = list.length-1 ; i >= 0 ; i--) {
		var included = include.item(arr, list[i])
		if(!result) result = included
	}
	return result
}

include.item = function(arr, item) {
	var included = null
	for(var j = arr.length-1 ; j >= 0 ; j--) {
		if(arr[j] === item) {
			included = true
			break
		}
	}
	return !included && arr.push(including)
}