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
  _entries: ResizeObserverEntry[],
  _observer: ResizeObserver
) => undefined;

export const mockResizeObserverHandle = {
  callback: defaultCallback,
  emit: (entries: ResizeObserverEntry[], observer?: ResizeObserver): void => {
    mockResizeObserverHandle.callback(entries, observer as ResizeObserver);
  },
};

export function mockResizeObserver(): void {
  (window as any).requestAnimationFrame = (callback: () => void): number => {
    callback();
    return 0;
  };
  (window as any).cancelAnimationFrame = (_: number): void => undefined;
  window.ResizeObserver = class {
    constructor(callback: ResizeObserverCallback) {
      mockResizeObserverHandle.callback = callback;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public disconnect(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public observe(_target: Element, _options?: ResizeObserverOptions): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public unobserve(_element: HTMLElement): void {}
  };
}
