export const mockResizeObserverEntry: ResizeObserverEntry = {
  target: {} as Element,
  borderBoxSize: [],
  contentBoxSize: [],
  contentRect: {
    width: 20,
    height: 20,
    x: 20,
    y: 20,
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
    toJSON: () => 'true',
  } as DOMRectReadOnly,
  devicePixelContentBoxSize: [],
};

const defaultCallback = (entry: ResizeObserverEntry[]) => {
  console.log(entry);
};

export const mockResizeObserverHandle = {
  callback: defaultCallback,
  emit: (entry: ResizeObserverEntry[]) => {
    mockResizeObserverHandle.callback(entry);
  },
};

export function mockResizeObserver() {
  window.ResizeObserver = class {
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
