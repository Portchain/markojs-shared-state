var API = require('./API.js')

function SharedState() {
  this._boundComponents = [];
  this._boundFields = {};
  this._listeners = {};
  this._state = {}
}

SharedState.prototype.bind = function(component, fields) {
  if(!component || !fields || !fields.length) {
    return;
  }
  this._boundComponents.push({
    component: component,
    fields: fields
  });
  for(var i = 0 ; i < fields.length ; i++) {
    var field = fields[i]
    if(!this._boundFields[field]) {
      this._boundFields[field] = []
    }
    this._boundFields[field].push(component)
    if(this._state[field] !== undefined) {
      component.setState(field, this._state[field])
    }
  }
}

SharedState.prototype.unbind = function(component) {
  for(var i = 0 ; i < this._boundComponents.length ; i++) {
    if(this._boundComponents[i].component === component) {
      var fields = this._boundComponents[i].fields
      this._boundComponents.splice(i, 1);
      for(var j = 0 ; j < fields.length ; j++) {
        var fieldComponents = this._boundFields[fields[j]]
        for(var k = 0 ; k < fieldComponents.length ; k++) {
          if(fieldComponents[k] === component) {
            fieldComponents.splice(k, 1);
          }
          break;
        }
      }
      break;
    }
  }
}

SharedState.prototype.setState = function(field, value) {
  if(this._state[field] !== value) {
    this._state[field] = value
    if(this._boundFields[field]) {
      for(var i = 0 ; i < this._boundFields[field].length ; i++) {
        var component = this._boundFields[field][i]
        component.setState(field, value)
      }
    }
    this.emit(field, this._state[field])
  }
}

SharedState.prototype.getState = function(field) {
  return this._state[field]
}

SharedState.prototype.setStateDirty = function(field, optionalValue) {
  if(this._boundFields[field]) {
    for(var i = 0 ; i < this._boundFields[field].length ; i++) {
      var component = this._boundFields[field][i]
      component.setStateDirty(field, optionalValue)
    }
  }
  this.emit(field, this._state[field])
}

SharedState.prototype.on = function(eventName, func) {
  if(!this._listeners[eventName]) {
    this._listeners[eventName] = []
  }
  this._listeners[eventName].push(func)
}

SharedState.prototype.off = function(eventName, func) {
  if(!func) {
    // remove all listeners for that event
    this._listeners[eventName] = [];
  } else if(this._listeners[eventName]) {
    for(var i = 0 ; i < this._listeners[eventName].length ; i++) {
      if(this._listeners[eventName][i] === func) {
        this._listeners[eventName].splice(i, 1);
        break;
      }
    }
  }
}

SharedState.prototype.emit = function(eventName, data) {
  if(this._listeners[eventName]) {
    for(var i = 0 ; i < this._listeners[eventName].length ; i++) {
      this._listeners[eventName][i].call(null, data)
    }
  }
}

SharedState.prototype.defineAPI = function(apiName) {
  if(SharedState.prototype[apiName]) {
    throw new Error('You cannot use API with name [' + apiName + '] because it is a reserved keyword') 
  }
  if(!apiName) {
    throw new Error('SharedState.defineAPI apiName cannot be null')
  }
  var api = new API()
  this[apiName] = api
  return api
}

var sharedState

module.exports = function() {
  if(!sharedState) {
    sharedState = new SharedState()
  }
  return sharedState
}

