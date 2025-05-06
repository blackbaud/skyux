/* istanbul ignore file: these are used in @skyux/core */

/**
 * @internal
 */
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
  observer: ResizeObserver,
) => {};

/**
 * @internal
 */
export const mockResizeObserverHandle = {
  callback: defaultCallback,
  emit: (entries: ResizeObserverEntry[], observer?: ResizeObserver): void => {
    mockResizeObserverHandle.callback(entries, observer!);
  },
};

/**
 * @internal
 */
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

    public disconnect(): void {}

    public observe(target: Element, options?: ResizeObserverOptions): void {}

    public unobserve(element: HTMLElement): void {}
  };
}
