"use strict";
var Base = require('./index.js')
var proto = Base.prototype
var Operator = require('./operator.js')
var util = require('../util')
var forEach = require('lodash/collection/forEach')
var define = Object.defineProperty

var Results = new Base({
  $key:'$results'
}).$Constructor
//also use Array type for this

//Results word de vervanging voor selection
//observable!

//todo -- maak $.
//$. voor methods
//$.map
//$.each
//$.filter
//add translations voor alle operators
//allemaal alles supporten?
//normal objects en vobj
//of gewoon vobj results obj maken

proto.$flags = {
  //this operator is going to be pure power balls
  $map:new Operator({
    $key:'$map',
    $operator:function( val, operator, origin ) {
      if(!this.$results) {
        this.$results = new Results({}, false ,this)  
      }
      var arr = this.$results
      if(util.isPlainObj( val )) {
        forEach( val, function( field, key ) {
          arr.$setKey( key, operator._$val( field, key, false ) )
        })
      } else {
        val.$each(function( field, key ) {
          var result = operator._$val( field, key )
          if( result ) {
            
            //ff dingen weghalen ook hiero
            //only set this
            //different dan clear

            arr.$setKey( key, result, false )
          } else {
              
            // arr.$setKey( key, 'go away!' )
            console.log('===>REMOVE', key)
            //REMOVE KEY!

          }
        }, function(field) {
          return !operator._$operators[field]
        })
      }
      return arr
    }
  }),
  $add:new Operator({
    $key:'$add',
    $operator:function( val, operator, origin ) {
      
      //cache met EVENT!
      if(typeof val === 'object') {       
        
        //has to be made when nessecary -- when there is a result
        //make these generic

        if(!this.$results) {
          //results have to be from the this
          this.$results = new Results({}, false, this)  
        }
        var arr = this.$results
        if(util.isPlainObj(val)) {
          forEach(val, function(field, key ) {
            arr.$setKey( key, field, false )
          })
        } else if(val instanceof Base) {
          val.$each(function(field, key) {
             arr.$setKey( key, field, false ) 
          }, function(field) {
            return !operator._$operators[field]
          })
        }

        val = operator.$parseValue( val, origin )

        if(val === operator) {
          operator.$each(function(field, key) {
            arr.$setKey( key, field )
          })
        } else {
          arr.$setKey( 'addOnResult', val, false )
        }
        return arr
      }

      return val + operator.$parseValue( val, origin )
    }
  }),
  $transform:new Operator({
    $key:'$transform',
    $operator:function( val, operator, origin ) {
      var parsed = operator.$parseValue( val, origin )
      // if(parsed === operator) {
      //   return operator
      // }
      return parsed 
    }
  })
}
