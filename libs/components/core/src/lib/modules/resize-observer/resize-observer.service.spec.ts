import { ElementRef, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  mockResizeObserver,
  mockResizeObserverHandle,
  mockResizeObserverReset,
} from './fixtures/resize-observer-mock';
import { SkyResizeObserverService } from './resize-observer.service';

describe('ResizeObserver service', async () => {
  beforeAll(() => {
    mockResizeObserver();
  });

  afterAll(() => {
    mockResizeObserverReset();
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
    const entry: ResizeObserverEntry = {
      target: target.nativeElement,
      borderBoxSize: [],
      contentBoxSize: [],
      contentRect: {} as DOMRectReadOnly,
    };
    let result: ResizeObserverEntry | undefined = undefined;
    const service = new SkyResizeObserverService(TestBed.inject(NgZone));
    const subscription = service
      .observe(target)
      .subscribe((resizeObserverEntry) => {
        result = { ...resizeObserverEntry };
      });
    expect(result).toBeFalsy();
    mockResizeObserverHandle.emit([entry]);
    expect(result).toEqual(entry);
    subscription.unsubscribe();
  });
});
