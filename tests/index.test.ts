import { createEventManager, createListenerCollection } from '../src';

describe('ListenerCollection', () => {
  //const handle = jest.fn();

  it('check property', () => {
    const listener = createListenerCollection();
    ['clear', 'get', 'subscribe', 'unsubscribe', 'notify'].forEach(
      (property) => {
        expect(listener).toHaveProperty(property);
      }
    );
  });

  describe('subscribe and notify', () => {
    const listener = createListenerCollection();
    const handle = jest.fn();

    it('one subscribe and get listener', () => {
      listener.subscribe(handle);
      const listeners = listener.get();
      expect(listeners.length).toBe(1);
      expect(listeners[0].callback).toBe(handle);
    });

    it('notify', () => {
      listener.notify();
      expect(handle).toBeCalled();
    });
  });

  it('subscribe return a unsubscribe and the unsubscribe run', () => {
    const listener = createListenerCollection();
    const handle = jest.fn();
    const unsubscribe = listener.subscribe(handle);
    expect(unsubscribe).toEqual(expect.any(Function));

    unsubscribe();
    listener.notify();
    expect(handle).not.toBeCalled();
  });

  describe('notify with args and unsubscribe', () => {
    const listener = createListenerCollection<[string, string]>();
    const handle = jest.fn();

    it('one subscribe and notify', () => {
      listener.subscribe(handle);
      listener.notify('param1', 'param2');
      expect(handle).toBeCalledWith('param1', 'param2');
    });

    it('unsubscribe by callback', () => {
      const result = listener.unsubscribe(handle);
      expect(result).toBeTruthy();

      listener.notify('param1', 'param2');
      expect(handle).toHaveBeenCalledTimes(1);
    });
  });

  it('call order with few args', () => {
    const listener = createListenerCollection<[string, string]>();
    const callOrder = [];
    const handle = jest.fn(() => callOrder.push(1));
    const handle2 = jest.fn(() => callOrder.push(2));
    const handle3 = jest.fn(() => callOrder.push(3));
    listener.subscribe(handle);
    listener.subscribe(handle2);
    listener.subscribe(handle3);
    listener.notify('param1', 'param2');

    expect(callOrder).toEqual([1, 2, 3]);
    expect(handle).toBeCalledWith('param1', 'param2');
    expect(handle2).toBeCalledWith('param1', 'param2');
    expect(handle3).toBeCalledWith('param1', 'param2');
  });

  it('clear', () => {
    const listener = createListenerCollection();
    const handle = jest.fn();
    const handle2 = jest.fn();
    listener.subscribe(handle);
    listener.subscribe(handle2);
    let listeners = listener.get();
    expect(listeners.length).toBe(2);

    listener.clear();
    listeners = listener.get();
    expect(listeners.length).toBe(0);
  });
});

describe('EventManager', () => {
  it('check property', () => {
    const manager = createEventManager();
    [
      'on',
      'off',
      'addListener',
      'removeListener',
      'removeAllListeners',
      'emit',
      'once',
    ].forEach((property) => {
      expect(manager).toHaveProperty(property);
    });
  });

  it('new event and add one listener then run emit', () => {
    const manager = createEventManager();
    const handle = jest.fn();
    manager.on('test1', handle);
    manager.emit('test1');
    expect(handle).toBeCalled();
  });

  describe('emit and removeListener', () => {
    const manager = createEventManager<[string, string]>();
    const handle = jest.fn();

    it('run emit with few args', () => {
      manager.on('test2', handle);
      manager.emit('test2', 'arg1', 'arg2');
      expect(handle).toBeCalledWith('arg1', 'arg2');
    });

    it('remove listener', () => {
      manager.removeListener('test2', handle);
      expect(handle).toHaveBeenCalledTimes(1);
    });
  });

  describe('few events', () => {
    const manager = createEventManager();
    const handle = jest.fn();
    const handle2 = jest.fn();
    const handle3 = jest.fn();

    it('add 2 events and emit 2s event', () => {
      manager.on('test3', handle);
      manager.on('test4', handle2);
      manager.emit('test4');
      expect(handle).not.toBeCalled();
      expect(handle2).toBeCalled();
    });

    it('add 3 listeners then 1 listener unsubscribe', () => {
      const handle2 = jest.fn();
      manager.on('test5', handle);
      const unsubscribeHandle2 = manager.on('test5', handle2);
      manager.on('test5', handle3);
      unsubscribeHandle2();
      manager.emit('test5');
      expect(handle).toBeCalled();
      expect(handle2).not.toBeCalled();
      expect(handle3).toBeCalled();
    });

    it('removeAllListeners', () => {
      manager.removeAllListeners();
      manager.emit('test4');
      manager.emit('test5');

      expect(handle).toHaveBeenCalledTimes(1);
      expect(handle2).toHaveBeenCalledTimes(1);
      expect(handle3).toHaveBeenCalledTimes(1);
    });

    it('should apply event un-registration even when asked after the emission', () => {
      const handle2 = jest.fn();
      const handle = jest.fn(() => {
        manager.removeListener('test7', handle2);
      });
      manager.on('test7', handle);
      manager.on('test7', handle2);
      manager.emit('test7');
      expect(handle).toBeCalled();
      expect(handle2).not.toBeCalled();
    });
  });

  describe('once listener', () => {
    const manager = createEventManager();
    const handle = jest.fn();
    const handle2 = jest.fn();

    it('once listener', () => {
      manager.on('test6', handle);
      manager.once('test6', handle2);
      manager.emit('test6');
      expect(handle).toBeCalled();
      expect(handle2).toBeCalled();
    });

    it('check called once listener', () => {
      manager.emit('test6');
      expect(handle).toHaveBeenCalledTimes(2);
      expect(handle2).toHaveBeenCalledTimes(1);
    });
  });
});
