"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

define( proto, '$origin', {
  get:function() {
    var reference = this
    while( reference._$val instanceof Base ) {
      reference = reference._$val
    }
    return reference
  }
})

define( proto, '$parseValue', {
  value:function(previousValue) {

    console.error('lats parse it!', previousValue, this, this.$path )

    //now -- parsse operators by checking instance of or just check for $operator
    var val = this._$val
    if(val) {
      //special flag dat functie niet geget moet worden
      //dit is voor methods
      if( typeof val === 'function' ) {
        //make this into a funciton e.g. $execGetterFunction
        var context = this._$bind && this._$bind._$val || this
        if( context ) {
          if( typeof context === 'function' ) {
            //send val as well -- take previous val into account in $parseValue
            context = context.call(this, previousValue)
          } else if( context === '$parent' ) { 
            //this will be replaced with a general path functionality (that includes)
            context = this.$parent
          } else {
            context = this
          }
        }
        val = val.call(context, previousValue)
      } else if( val instanceof Base ) {
        val = val.$val
      } else {
        val = this._$val
      }
    }

    //maybe make an if Operator?
    var operator = this.$Operator.prototype

    //add this to operators as well?
    //now custom orders
    if( operator.$hasOperators( this ) ) {
      var operators = operator._$operators
      for( var key$ in this ) {
        if(operators[key$]) {
          var operator$ = this[key$]
          //optmization for transform / map
          val = operator$._$operator( val, operator$.$parseValue( val ) )
        }
      }
    }

    return val
  }
})

define( proto , '$val', {
  get:function() {
    return this.$parseValue()
  },
  set:function( val ) {
    this.$set( val )
  }
})

proto.$flags = {
  $val: function(val) {
    this._$val = val
  }
}

define( proto, '$Operator', {
  value: require('./operator.js'),
  configurable:true 
})



