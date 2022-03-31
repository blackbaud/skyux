import { ElementRef, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyMediaBreakpoints } from '@skyux/core';

import {
  mockResizeObserver,
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
    const entry: ResizeObserverEntry = {
      target: target.nativeElement,
      borderBoxSize: [],
      contentBoxSize: [],
      contentRect: {} as DOMRectReadOnly,
    };
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
        ...entry,
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
        },
      },
    ]);
    expect(result).toEqual(SkyMediaBreakpoints.xs);
    mockResizeObserverHandle.emit([
      {
        ...entry,
        contentRect: {
          width: 2000,
          height: 20,
          x: 20,
          y: 20,
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
          toJSON: () => 'true',
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
});
