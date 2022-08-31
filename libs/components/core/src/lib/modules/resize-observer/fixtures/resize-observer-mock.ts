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

const defaultCallback: ResizeObserverCallback = (
  entries: ResizeObserverEntry[],
  observer: ResizeObserver
) => {};

export const mockResizeObserverHandle = {
  callback: defaultCallback,
  emit: (entries: ResizeObserverEntry[], observer?: ResizeObserver) => {
    mockResizeObserverHandle.callback(entries, observer!);
  },
};

export function mockResizeObserver() {
  window.ResizeObserver = class {
    constructor(callback: ResizeObserverCallback) {
      mockResizeObserverHandle.callback = callback;
    }

    disconnect() {}

    observe(target: Element, options?: ResizeObserverOptions) {}

    unobserve(element: HTMLElement) {}
  };
}
