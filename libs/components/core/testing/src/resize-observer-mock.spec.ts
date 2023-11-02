describe('resize-observer-mock', () => {
  it('should provide mockResizeObserverEntry', async () => {
    const { mockResizeObserverEntry } = await import('./resize-observer-mock');
    expect(mockResizeObserverEntry.contentRect.toJSON()).toEqual('true');
  });

  it('should mock ResizeObserver', async () => {
    const {
      mockResizeObserver,
      mockResizeObserverEntry,
      mockResizeObserverHandle,
    } = await import('./resize-observer-mock');
    spyOn(mockResizeObserverHandle, 'callback').and.callThrough();
    mockResizeObserver();
    expect(window.ResizeObserver).toBeDefined();
    const observer = new window.ResizeObserver(
      mockResizeObserverHandle.callback
    );
    observer.observe(document.body);
    mockResizeObserverHandle.emit([mockResizeObserverEntry], observer);
    expect(mockResizeObserverHandle.callback).toHaveBeenCalledWith(
      [mockResizeObserverEntry],
      observer
    );
    observer.unobserve(document.body);
    observer.disconnect();
  });

  it('should mock requestAnimationFrame', async () => {
    const { mockResizeObserver } = await import('./resize-observer-mock');
    mockResizeObserver();
    const callback = jasmine.createSpy('requestAnimationFrame');
    expect(window.requestAnimationFrame(callback)).toEqual(0);
    expect(callback).toHaveBeenCalled();
    expect(() => window.cancelAnimationFrame(0)).not.toThrow();
  });
});
