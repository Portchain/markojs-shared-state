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
