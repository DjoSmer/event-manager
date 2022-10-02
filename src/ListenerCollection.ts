//base source see https://github.com/reduxjs/react-redux/blob/720f0ba79236cdc3e1115f4ef9a7760a21784b48/src/utils/Subscription.ts
export type ListenerCallback<ARGS extends any[]> = (...args: ARGS) => void;

export type Listener<CB> = {
  active: boolean;
  callback: CB;
  next: Listener<CB> | null;
  prev: Listener<CB> | null;
  once: boolean;
};

export class ListenerCollection<
  ARGS extends any[],
  CB extends ListenerCallback<ARGS> = ListenerCallback<ARGS>
> {
  first: Listener<CB> | null = null;
  last: Listener<CB> | null = null;

  clear() {
    this.first = null;
    this.last = null;
  }

  notify(...args: ARGS) {
    let listener = this.first;
    while (listener) {
      listener.callback.apply(listener, args);
      if (listener?.once) this.unsubscribeByListener(listener);
      listener = listener.next;
    }
  }

  get() {
    let listeners = [];
    let listener = this.first;
    while (listener) {
      listeners.push(listener);
      listener = listener.next;
    }
    return listeners;
  }

  subscribe(callback: CB, once = false) {
    let listener = (this.last = {
      active: true,
      callback,
      next: null,
      prev: this.last,
      once,
    });

    if (listener.prev) {
      listener.prev.next = listener;
    } else {
      this.first = listener;
    }

    return () => {
      this.unsubscribeByListener(listener);
    };
  }

  unsubscribe(callback: CB) {
    let listener = this.first;
    let result = false;
    while (listener) {
      if (listener.callback === callback) {
        this.unsubscribeByListener(listener);
        result = true;
      }
      listener = listener.next;
    }
    return result;
  }

  unsubscribeByListener(listener: Listener<CB>) {
    if (!listener.active || this.first === null) return;
    listener.active = false;

    if (listener.next) {
      listener.next.prev = listener.prev;
    } else {
      this.last = listener.prev;
    }
    if (listener.prev) {
      listener.prev.next = listener.next;
    } else {
      this.first = listener.next;
    }
  }
}

export function createListenerCollection<ARGS extends any[] = []>() {
  return new ListenerCollection<ARGS>();
}
