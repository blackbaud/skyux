import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  mockResizeObserver,
  mockResizeObserverEntry,
  mockResizeObserverHandle,
  stopMockResizeObserver,
} from './fixtures/resize-observer-mock';
import { SkyResizeObserverService } from './resize-observer.service';

describe('ResizeObserver service', () => {
  beforeAll(() => {
    mockResizeObserver();
  });

  afterAll(() => {
    stopMockResizeObserver();
  });

  it('should return a new instance of a resize observer', () => {
    const service = TestBed.inject(SkyResizeObserverService);
    expect(service).toBeTruthy();
    service.ngOnDestroy();
  });

  function createNewElementRef(): ElementRef<HTMLDivElement> {
    const nativeElement = document.createElement('div');
    document.body.appendChild(nativeElement);
    return new ElementRef(nativeElement);
  }

  function destroyElementRef(target: ElementRef): void {
    target.nativeElement.remove();
  }

  it('should observe an element resize', () => {
    const target = createNewElementRef();
    let result: ResizeObserverEntry | undefined;
    const service = TestBed.inject(SkyResizeObserverService);
    const subscription = service
      .observe(target)
      .subscribe((resizeObserverEntry) => {
        result = { ...resizeObserverEntry };
      });
    expect(result).toBeFalsy();
    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        target: target.nativeElement,
      },
    ]);
    expect(result).toEqual({
      ...mockResizeObserverEntry,
      target: target.nativeElement,
    });
    subscription.unsubscribe();
    destroyElementRef(target);
  });

  it('should handle multiple observers', () => {
    const target = createNewElementRef();
    let result: ResizeObserverEntry | undefined;
    const service = TestBed.inject(SkyResizeObserverService);
    const subscription1 = service
      .observe(target)
      .subscribe((resizeObserverEntry) => {
        result = { ...resizeObserverEntry };
      });
    const subscription2 = service
      .observe(target)
      .subscribe((resizeObserverEntry) => {
        result = { ...resizeObserverEntry };
      });
    expect(result).toBeFalsy();
    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        target: target.nativeElement,
      },
    ]);
    expect(result).toEqual({
      ...mockResizeObserverEntry,
      target: target.nativeElement,
    });
    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        contentRect: {
          ...mockResizeObserverEntry.contentRect,
          height: 100,
        },
        target: target.nativeElement,
      },
    ]);
    expect(result).toEqual({
      ...mockResizeObserverEntry,
      contentRect: {
        ...mockResizeObserverEntry.contentRect,
        height: 100,
      },
      target: target.nativeElement,
    });
    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        contentRect: {
          ...mockResizeObserverEntry.contentRect,
          height: 100.1,
        },
        target: target.nativeElement,
      },
    ]);
    expect(result).toEqual({
      ...mockResizeObserverEntry,
      contentRect: {
        ...mockResizeObserverEntry.contentRect,
        height: 100,
      },
      target: target.nativeElement,
    });
    subscription1.unsubscribe();
    subscription2.unsubscribe();
    destroyElementRef(target);
  });

  it('should handle empty entry list', () => {
    const nativeElement = document.createElement('div');
    document.body.appendChild(nativeElement);
    const target = new ElementRef(nativeElement);
    const service = TestBed.inject(SkyResizeObserverService);
    const subscriber = jasmine.createSpy('subscriber');
    const subscription = service.observe(target).subscribe(subscriber);
    expect(subscriber).not.toHaveBeenCalled();
    mockResizeObserverHandle.emit([]);
    expect(subscriber).not.toHaveBeenCalled();
    subscription.unsubscribe();
    nativeElement.remove();
  });

  it('should capture resize observer error event on destroy', () => {
    const target = createNewElementRef();
    const error: ErrorEvent[] = [];
    window.addEventListener('error', (event) => error.push(event));
    const service = TestBed.inject(SkyResizeObserverService);
    const subscription = service.observe(target).subscribe({
      complete: () => {
        window.dispatchEvent(
          new ErrorEvent('error', {
            message:
              'ResizeObserver loop completed with undelivered notifications.',
          }),
        );
      },
    });
    subscription.unsubscribe();
    destroyElementRef(target);
    expect(error).toEqual([]);
  });

  it('should capture resize observer error via onerror on destroy', () => {
    // window.onerror is how Karma/Jasmine captures errors.
    // This test expects window errors and needs the test runner not to fail on errors.
    window.onerror = null;
    const target = createNewElementRef();
    const service = TestBed.inject(SkyResizeObserverService);
    expect(window.onerror).toBeTruthy();
    spyOn(window as any, 'onerror').and.callThrough();
    const subscription = service.observe(target).subscribe();
    const errorEvent = new ErrorEvent('error', {
      message: 'ResizeObserver loop completed with undelivered notifications.',
    });
    if (window.onerror) {
      (window as any).onerror(errorEvent);
      (window as any).onerror('Other error.');
    }
    subscription.unsubscribe();
    destroyElementRef(target);
    expect(window.onerror).toHaveBeenCalledWith(errorEvent);
    expect(window.onerror).toHaveBeenCalledWith('Other error.');
  });

  it('should not capture other errors on destroy', () => {
    // window.onerror is how Karma/Jasmine captures errors.
    // This test expects window errors and needs the test runner not to fail on errors.
    window.onerror = null;
    const target = createNewElementRef();
    const error: ErrorEvent[] = [];
    const service = TestBed.inject(SkyResizeObserverService);
    window.addEventListener('error', (event) => error.push(event));
    const subscription = service.observe(target).subscribe();
    window.dispatchEvent(
      new ErrorEvent('error', {
        message:
          'ResizeObserver loop completed with undelivered notifications.',
      }),
    );
    window.dispatchEvent(
      new ErrorEvent('error', {
        message: 'Other error.',
      }),
    );
    subscription.unsubscribe();
    destroyElementRef(target);
    expect(error.map((e) => e.message)).toContain('Other error.');
    expect(error.map((e) => e.message)).not.toContain(
      'ResizeObserver loop completed with undelivered notifications.',
    );
  });
});
