const originalResizeObserver = global.ResizeObserver;

const defaultCallback = (entry: ResizeObserverEntry[]) => {
  console.log(entry);
};

export const mockResizeObserverHandle = {
  callback: defaultCallback,
  emit: (entry: ResizeObserverEntry[]) => {
    mockResizeObserverHandle.callback(entry);
  },
};

export function mockResizeObserverReset() {
  mockResizeObserverHandle.callback = defaultCallback;
  global.ResizeObserver = originalResizeObserver;
}

export function mockResizeObserver() {
  global.ResizeObserver = class {
    constructor(callback) {
      mockResizeObserverHandle.callback = callback;
    }
    disconnect() {
      [].push(undefined);
    }
    observe(element, initObject) {
      [element, initObject].pop();
    }
    unobserve(element) {
      [element].pop();
    }
  };
}
