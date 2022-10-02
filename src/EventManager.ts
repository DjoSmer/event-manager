import { ListenerCollection, ListenerCallback } from './ListenerCollection';

export type EventCollection<
  ARGS extends any[],
  CB extends ListenerCallback<ARGS>
> = {
  [k: string]: ListenerCollection<ARGS, CB>;
};

export class EventManager<
  ARGS extends any[],
  CB extends ListenerCallback<ARGS> = ListenerCallback<ARGS>
> {
  private events: EventCollection<ARGS, CB> = {};

  on(eventName: string, callback: CB, once = false) {
    let collection = this.get(eventName);
    if (!collection) {
      collection = new ListenerCollection<ARGS, CB>();
      this.events[eventName] = collection;
    }
    return collection.subscribe(callback, once);
  }

  addListener(eventName: string, callback: CB, once = false) {
    return this.on(eventName, callback, once);
  }

  removeListener(eventName: string, callback: CB) {
    let collection = this.get(eventName);
    collection.unsubscribe(callback);
  }

  off(eventName: string, callback: CB) {
    return this.removeListener(eventName, callback);
  }

  removeAllListeners() {
    this.events = {};
  }

  emit(eventName: string, ...args: ARGS) {
    const collection = this.get(eventName);
    if (!collection) {
      return;
    }
    collection.notify.apply(collection, args);
  }

  once(eventName: string, callback: CB) {
    return this.addListener(eventName, callback, true);
  }

  get(eventName: string) {
    return this.events[eventName];
  }

  gets() {
    return this.events;
  }
}

export function createEventManager<ARGS extends any[] = []>() {
  return new EventManager<ARGS>();
}
