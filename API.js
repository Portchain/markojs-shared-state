function API() {
}

API.prototype.action = function(funcName, func) {
  if(funcName === 'action') {
    throw new Error('You cannot define an action named [action] as it is a reserved keyword')
  }
  this[funcName] = func
  return this
}

module.exports = API
