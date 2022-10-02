# EventManager
Use Event Manager Or create Listener and subscribe to it.

## Installation

```bash
$ npm install --save @djosmer/event-manager
$ yarn add @djosmer/event-manager
```

## Usage

### EventManager
Create Event Manager and add any events.

```ts
import {createEventManager} from "@djosmer/event-manager";

const handle = (message: string, code: number) => {
    console.log('handle', message, code);
}

const eventManager = createEventManager<[string, number]>();
eventManager.on('eventName', handle);
const unsubscribe = eventManager.on('eventName', handle);
eventManager.addListener('eventName', handle);
eventManager.once('eventName', handle);
eventManager.emit('eventName', 'hello', 45);

//remove second listener;
unsubscribe();

//remove all "handle" listener
eventManager.off('eventName', handle);
// or
eventManager.removeListener('eventName', handle);
```

### Listener
Or create Listener and subscribe to it.

```ts
import {createListenerCollection} from "@djosmer/event-manager";

const handle = (message: string) => {
    console.log('handle', message);
}

const listener = createListenerCollection<string>();

//Subscribe to the listener
const unsubscribe = listener.subscribe(handle);

//Notify subscribers
listener.notify('hello');

//Unsubscribe to the listener
unsubscribe();
```

## Api reference

### EventManager
- `createEventManager<ARGS extends any[] = []>()`
- `new EventManager<ARGS extends any[], CB extends ListenerCallback<ARGS> = ListenerCallback<ARGS>>()`

#### `on(eventName: string, callback: CB, once = false): unsubscribe(): void`
#### `addListener(eventName: string, callback: CB, once = false): unsubscribe(): void`
Adds the `callback` function to the end of the `ListenerCollection` for the event named `eventName`. 
No checks are made to see if the `callback` has already been added. 
Multiple calls passing the same combination of `eventName` and `callback` will result in the `callback` being added, 
and called, multiple times.

#### `off(eventName: string, callback: CB): void`
#### `removeListener(eventName: string, callback: CB): void`
Removes the specified `callback` from the `ListenerCollection` for the event named `eventName`.

#### `removeAllListeners(): void`
Removes all `ListenerCollection`, or those of the specified `eventName`.

#### `emit(eventName: string, ...args: ARGS): void`
Synchronously calls each of the `Listener` registered for the event named `eventName`, 
in the order they were registered, passing the supplied arguments to each.

#### `once(eventName: string, callback: CB): unsubscribe(): void`
Adds a **one-time** `listener` for the event named `eventName`. The next time `eventName` is triggered, this `listener` is removed and then invoked.

#### `get(eventName: string): ListenerCollection<ARGS extends any[], CB extends ListenerCallback<ARGS>`
#### `gets(): EventCollection<ARGS extends any[], CB extends ListenerCallback<ARGS>`

### ListenerCollection
- `createListenerCollection<ARGS extends any[] = []>()`
- `new ListenerCollection<ARGS extends any[], CB extends ListenerCallback<ARGS> = ListenerCallback<ARGS>>()`

#### `clear(): void`
Clear the `ListenerCollection`

#### `notify(...args: ARGS): void`
Synchronously calls each of the listeners registered for the `ListenerCollection`,
in the order they were registered, passing the supplied arguments to each.

#### `subscribe(callback: CB, once = false): unsubscribe(): void`
Subscribe from the listener.

#### `unsubscribe(callback: CB): boolean`
Unsubscribe from the listener.

#### `get(): Listener<CB>[]`

## License

[MIT](LICENSE)
