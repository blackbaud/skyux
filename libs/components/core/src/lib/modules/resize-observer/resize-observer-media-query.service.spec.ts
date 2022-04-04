import { ElementRef, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyMediaBreakpoints } from '@skyux/core';

import {
  mockResizeObserver,
  mockResizeObserverEntry,
  mockResizeObserverHandle,
  mockResizeObserverReset,
} from './fixtures/resize-observer-mock';
import { SkyResizeObserverMediaQueryService } from './resize-observer-media-query.service';
import { SkyResizeObserverService } from './resize-observer.service';

describe('SkyResizeObserverMediaQueryService service', async () => {
  beforeAll(() => {
    mockResizeObserver();
  });

  afterAll(() => {
    mockResizeObserverReset();
  });

  it('should return a new instance of a resize observer media query service', async () => {
    const zone = TestBed.inject(NgZone);
    const service = new SkyResizeObserverMediaQueryService(
      zone,
      new SkyResizeObserverService(zone)
    );
    expect(service).toBeTruthy();
    service.ngOnDestroy();
  });

  it('should emit breakpoints for an element resize', async () => {
    const target: ElementRef = {
      nativeElement: { id: 'element' },
    } as ElementRef;
    let result: SkyMediaBreakpoints | undefined = undefined;
    const zone = TestBed.inject(NgZone);
    const service = new SkyResizeObserverMediaQueryService(
      zone,
      new SkyResizeObserverService(zone)
    );
    service.observe(target);
    const subscription = service.subscribe((breakpoint) => {
      result = breakpoint;
    });
    expect(result).toBeFalsy();
    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        target: target.nativeElement,
      },
    ]);
    expect(result).toEqual(SkyMediaBreakpoints.xs);
    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        target: target.nativeElement,
        contentRect: {
          ...mockResizeObserverEntry.contentRect,
          width: 2000,
        },
      },
    ]);
    expect(result).toEqual(SkyMediaBreakpoints.lg);
    expect(service.current).toEqual(SkyMediaBreakpoints.lg);
    service.unobserve();
    expect(subscription.closed).toBeTrue();
    expect(service.current).toBeFalsy();
    expect(result).toBeFalsy();
  });

  it('should switch observing to a new element', async () => {
    const target1: ElementRef = {
      nativeElement: { id: 'element1' },
    } as ElementRef;
    const target2: ElementRef = {
      nativeElement: { id: 'element2', offsetWidth: 220 },
    } as ElementRef;
    let result: SkyMediaBreakpoints | undefined = undefined;
    const zone = TestBed.inject(NgZone);
    const service = new SkyResizeObserverMediaQueryService(
      zone,
      new SkyResizeObserverService(zone)
    );
    service.observe(target1);
    const subscription = service.subscribe((breakpoint) => {
      result = breakpoint;
    });
    expect(result).toBeFalsy();
    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        target: target1.nativeElement,
      },
    ]);
    expect(result).toEqual(SkyMediaBreakpoints.xs);
    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        target: target1.nativeElement,
        contentRect: {
          ...mockResizeObserverEntry.contentRect,
          width: 2000,
        },
      },
    ]);
    expect(result).toEqual(SkyMediaBreakpoints.lg);
    service.observe(target1);
    expect(service.current).toEqual(SkyMediaBreakpoints.lg);
    service.observe(target2);
    subscription.unsubscribe();
    expect(service.current).toEqual(SkyMediaBreakpoints.xs);
  });
});
