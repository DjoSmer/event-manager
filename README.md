# EventManager

## Installation

```bash
$ npm install --save @djosmer/event-manager
```

## Usage

After installation the only thing you need to do is require the module:

```js
import {createEventManager} from "@djosmer/event-manager";

const handle = (message) => {
    console.log('handle', message);
}

const eventManager = createEventManager();
eventManager.on('eventName', handle);
const unsubscribe = eventManager.on('eventName', handle);
eventManager.addListener('eventName', handle);
eventManager.once('eventName', handle);
eventManager.emit('eventName', 'hello');

//remove second listener;
unsubscribe();
//remove all "handle" listener
eventManager.off('eventName', handle);
// or
eventManager.removeListener('eventName', handle);
```

### Tests

This module is well tested. You can run:

- `npm test` to run the tests under Node.js.

## License

[MIT](LICENSE)
