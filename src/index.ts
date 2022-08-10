//base source see https://github.com/reduxjs/react-redux/blob/720f0ba79236cdc3e1115f4ef9a7760a21784b48/src/utils/Subscription.ts

export type VoidFunc = (...args: any[]) => void;

export type Listener<CB extends VoidFunc> = {
  callback: CB;
  next: Listener<CB> | null;
  prev: Listener<CB> | null;
  once: boolean;
};

export function createListenerCollection<CB extends VoidFunc>() {
  let first: Listener<CB> | null = null;
  let last: Listener<CB> | null = null;

  const clear = () => {
    first = null;
    last = null;
  };

  const notify = (...args: any[]) => {
    let listener = first;
    while (listener) {
      listener.callback.apply(listener, args);
      if (listener?.once) _unsubscribe(listener);
      listener = listener.next;
    }
  };

  const get = () => {
    let listeners: Listener<CB>[] = [];
    let listener = first;
    while (listener) {
      listeners.push(listener);
      listener = listener.next;
    }
    return listeners;
  };

  const subscribe = (callback: CB, once = false) => {
    let isSubscribed = true;

    let listener = (last = {
      callback,
      next: null,
      prev: last,
      once,
    });

    if (listener.prev) {
      listener.prev.next = listener;
    } else {
      first = listener;
    }

    return function unsubscribe() {
      if (!isSubscribed || first === null) return;
      isSubscribed = false;
      _unsubscribe(listener);
    };
  };

  const unsubscribe = (callback: CB) => {
    let listener = first;
    let result = false;
    while (listener) {
      if (listener.callback === callback) {
        _unsubscribe(listener);
        result = true;
      }
      listener = listener.next;
    }
    return result;
  };

  const _unsubscribe = (listener: Listener<CB>) => {
    if (listener.next) {
      listener.next.prev = listener.prev;
    } else {
      last = listener.prev;
    }
    if (listener.prev) {
      listener.prev.next = listener.next;
    } else {
      first = listener.next;
    }
  };

  return {
    clear,
    notify,
    get,
    subscribe,
    unsubscribe,
  };
}

export type ListenerCollection<CB extends VoidFunc> = ReturnType<
  typeof createListenerCollection<CB>
>;

export type Events<CB extends VoidFunc> = {
  [k: string]: ListenerCollection<CB>;
};

export function createEventManager<CB extends VoidFunc>() {
  let events: Events<CB> = {};

  const addListener = (eventName: string, callback: CB, once = false) => {
    let collection = events[eventName];

    if (!collection) {
      collection = createListenerCollection<CB>();
      events[eventName] = collection;
    }
    return collection.subscribe(callback, once);
  };

  const removeListener = (eventName: string, callback: CB) => {
    let collection = events[eventName];
    collection.unsubscribe(callback);
  };

  const removeAllListeners = () => {
    events = {};
  };

  const emit = (eventName: string, ...args: any[]) => {
    const collection = events[eventName];
    if (!collection) {
      return;
    }
    collection.notify.apply(collection, args);
  };

  const once = (eventName: string, callback: CB) => {
    return addListener(eventName, callback, true);
  };

  const getEvents = () => events;

  return {
    on: addListener,
    off: removeListener,
    addListener,
    removeListener,
    removeAllListeners,
    emit,
    once,
    getEvents,
  };
}
