var assert = require('assert')

describe('shared state', () => {
  var sharedState = require('../SharedState.js')()

  it('bound component receives shared state update', (done) => {
    var component = {
      setState: (field, value) => {
        assert.equal(field, 'myField')
        assert.equal(value, 123)
        sharedState.unbind(component)
        done()
      }
    }
    sharedState.bind(component, ['myField'])
    sharedState.setState('myField', 123)
  })
  it('bound component does not receives shared state update if state has not changed', (done) => {
    var receiveCount = 0;
    var component = {
      setState: (field, value) => {
        receiveCount ++;
        assert.equal(field, 'myField2')
        assert.equal(value, 123)
        assert.equal(receiveCount, 1);
      }
    }
    sharedState.bind(component, ['myField2'])
    sharedState.setState('myField2', 123)
    setTimeout(function() {
      
      sharedState.setState('myField2', 123)
      
      setTimeout(function() {
        sharedState.unbind(component)
        done()
      }, 100)
    }, 10)
  })
  it('bound component does receives every shared state dirty, even if state has not changed', (done) => {
    var receiveCount = 0;
    var component = {
      setStateDirty: (field, value) => {
        receiveCount ++;
        assert.equal(field, 'myField3')
        assert.equal(value, 123)
        assert.ok(receiveCount <= 2);
        if(receiveCount === 2) {
          sharedState.unbind(component)
          done()
        }
      }
    }
    sharedState.bind(component, ['myField3'])
    sharedState.setStateDirty('myField3', 123)
    setTimeout(function() {
      
      sharedState.setStateDirty('myField3', 123)
      
    }, 10)
  })
  it('state change event fired for every shared state dirty, even if state has not changed', (done) => {
    var receiveCount = 0;
    
    var field = 'myField4';
    sharedState.on(field, function() {
      receiveCount ++;
      var value = sharedState.getState(field)
      assert.equal(value, 123)
      assert.ok(receiveCount <= 2);
      if(receiveCount === 2) {
        done()
      }
    })
    sharedState.setStateDirty(field, 123)
    setTimeout(function() {
      sharedState.setStateDirty(field, 123)
    }, 10)
  })

  it('bound component pre-set shared state', (done) => {
    sharedState.setState('myField', 1234)
    var component = {
      setState: (field, value) => {
        assert.equal(field, 'myField')
        assert.equal(value, 1234)
        sharedState.unbind(component)
        done()
      }
    }
    sharedState.bind(component, ['myField'])
  })

  it('unbind() should sever link between shared state and component', (done) => {
    var callCount = 0
    var component = {
      setState: (field, value) => {
        callCount++
        assert.equal(field, 'myField2')
        assert.equal(value, 123)
        sharedState.unbind(component)
        sharedState.setState('myField2', 123)
        setTimeout(() => {
          assert.equal(callCount, 1)
          done()
        }, 200)
      }
    }
    sharedState.bind(component, ['myField2'])
    sharedState.setState('myField2', 123)
  })

  it('defineAPI().action() should create a callable API', (done) => {
    sharedState
      .defineAPI('test')
      .action('success', done)
    sharedState.test.success()
  })

  it('defineAPI().action() passes args untouched', (done) => {
    sharedState
      .defineAPI('test')
      .action('success', (arg1, arg2, arg3) => {
        assert.ok(arg1, 1)
        assert.ok(arg2, 2)
        assert.ok(arg3, 3)
        done()
      })
    sharedState.test.success(1, 2, 3)
  })
})
