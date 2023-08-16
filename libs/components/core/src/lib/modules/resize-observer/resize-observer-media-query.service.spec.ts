import { ElementRef, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';

import {
  mockResizeObserver,
  mockResizeObserverEntry,
  mockResizeObserverHandle,
} from './fixtures/resize-observer-mock';
import { SkyResizeObserverMediaQueryService } from './resize-observer-media-query.service';
import { SkyResizeObserverService } from './resize-observer.service';

describe('SkyResizeObserverMediaQueryService service', async () => {
  beforeAll(() => {
    mockResizeObserver();
  });

  it('should return a new instance of a resize observer media query service', async () => {
    const zone = TestBed.inject(NgZone);
    const service = new SkyResizeObserverMediaQueryService(
      new SkyResizeObserverService(zone)
    );
    expect(service).toBeTruthy();
    service.ngOnDestroy();
  });

  it('should emit breakpoints for an element resize', async () => {
    const target: ElementRef = {
      nativeElement: { id: 'element' },
    } as ElementRef;

    let result: SkyMediaBreakpoints | undefined;

    const zone = TestBed.inject(NgZone);
    const service = new SkyResizeObserverMediaQueryService(
      new SkyResizeObserverService(zone)
    );
    service.observe(target);
    const subscription = service.subscribe((breakpoint) => {
      result = breakpoint;
    });
    expect(result).toBeUndefined();
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
    service.destroy();
    expect(subscription.closed).toBeTrue();
  });

  it("should update the observed element's classes on resize when updateResponsiveClasses is true", () => {
    const testEl = document.createElement('div');
    const target = new ElementRef(testEl);

    const zone = TestBed.inject(NgZone);
    const service = new SkyResizeObserverMediaQueryService(
      new SkyResizeObserverService(zone)
    );

    service.observe(target, { updateResponsiveClasses: true });

    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        target: target.nativeElement,
      },
    ]);

    expect(testEl.className).toEqual('sky-responsive-container-xs');

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

    expect(testEl.className).toEqual('sky-responsive-container-lg');

    service.unobserve();
    service.destroy();

    expect(testEl.className).toEqual('');
  });

  it('should switch observing to a new element', async () => {
    const target1: ElementRef = {
      nativeElement: { id: 'element1' },
    } as ElementRef;
    const target2: ElementRef = {
      nativeElement: { id: 'element2', offsetWidth: 220 },
    } as ElementRef;
    let result: SkyMediaBreakpoints | undefined;
    const zone = TestBed.inject(NgZone);
    const service = new SkyResizeObserverMediaQueryService(
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
