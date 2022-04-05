import { ElementRef, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  mockResizeObserver,
  mockResizeObserverEntry,
  mockResizeObserverHandle,
} from './fixtures/resize-observer-mock';
import { SkyResizeObserverService } from './resize-observer.service';

describe('ResizeObserver service', async () => {
  beforeAll(() => {
    mockResizeObserver();
  });

  it('should return a new instance of a resize observer', async () => {
    const service = new SkyResizeObserverService(TestBed.inject(NgZone));
    expect(service).toBeTruthy();
    service.ngOnDestroy();
  });

  it('should observe an element resize', async () => {
    const target: ElementRef = {
      nativeElement: { id: 'element' },
    } as ElementRef;
    let result: ResizeObserverEntry | undefined = undefined;
    const service = new SkyResizeObserverService(TestBed.inject(NgZone));
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
  });

  it('should handle multiple observers', async () => {
    const target: ElementRef = {
      nativeElement: { id: 'element' },
    } as ElementRef;
    let result: ResizeObserverEntry | undefined = undefined;
    const service = new SkyResizeObserverService(TestBed.inject(NgZone));
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
    subscription1.unsubscribe();
    subscription2.unsubscribe();
  });
});
