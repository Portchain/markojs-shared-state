# Usage

Maintain a shared state between Marko js components without having to manually
pass input to all components.

## State sharing

```
// writer.component.js

var sharedState = require('marko-shared-state')()

module.exports = class {

  onMount() {
    var data = [{initial: true}]
    sharedState.setState('data', data)

    setTimeout(function() {
      notifs.push({delayed: true})
      sharedState.setState('data', data)
    }, 2000)

    // When updating an object or array, no need to set it again
    setTimeout(function() {
      notifs.push({dirtyOnly: true})
      sharedState.setStateDirty('data')
    }, 4000)
    
  }
}


```

```
// reader.component.js

module.exports = class {
  onMount() {
    sharedState.bind(this, ['notifs'])
    // will call setState('notifs', data) with the new data when the state changes
  }
  onRender() {
    console.log('render', this.state.notifs)
  }
}
  
```

## API sharing


```
// callee.component.js

var sharedState = require('markojs-shared-state')()

module.exports = class {

  onMount() {
    sharedState
      .defineAPI('user')
      .action('update', function(userData) {
        // this will be called through sharedState.user.update()
      })
  }
  
}


```

```
// caller.component.js
var sharedState = require('markojs-shared-state')()
module.exports = class {
  onButtonClick() {
    sharedState.user.update(userData)
  }
}
  
```