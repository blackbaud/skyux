import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SkyBreakpoint } from '../breakpoint-observer/breakpoint';
import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';

import {
  mockResizeObserver,
  mockResizeObserverEntry,
  mockResizeObserverHandle,
  stopMockResizeObserver,
} from './fixtures/resize-observer-mock';
import { SkyResizeObserverMediaQueryService } from './resize-observer-media-query.service';
import { SkyResizeObserverService } from './resize-observer.service';

describe('SkyResizeObserverMediaQueryService service', () => {
  beforeAll(() => {
    mockResizeObserver();
  });

  afterAll(() => {
    stopMockResizeObserver();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyResizeObserverService, SkyResizeObserverMediaQueryService],
    });
  });

  it('should return a new instance of a resize observer media query service', () => {
    const service = TestBed.inject(SkyResizeObserverMediaQueryService);
    expect(service).toBeTruthy();
    service.ngOnDestroy();
  });

  it('should emit breakpoints for an element resize', () => {
    const nativeElement = document.createElement('div');
    document.body.appendChild(nativeElement);
    const target = new ElementRef(nativeElement);

    let result: SkyMediaBreakpoints | undefined;

    const service = TestBed.inject(SkyResizeObserverMediaQueryService);
    service.observe(target);
    const subscription = service.subscribe((breakpoint) => {
      result = breakpoint;
    });
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
    nativeElement.remove();
  });

  it('should emit when the breakpoint changes', () => {
    const nativeElement = document.createElement('div');
    document.body.appendChild(nativeElement);
    const target = new ElementRef(nativeElement);

    let result: SkyBreakpoint | undefined;

    const service = TestBed.inject(SkyResizeObserverMediaQueryService);
    service.observe(target);

    const subscription = service.breakpointChange.subscribe((breakpoint) => {
      result = breakpoint;
    });

    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        target: target.nativeElement,
      },
    ]);

    expect(result).toEqual('xs');

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

    expect(result).toEqual('lg');
    expect(service.current).toEqual(SkyMediaBreakpoints.lg);

    service.unobserve();
    service.destroy();

    expect(subscription.closed).toBeTrue();

    nativeElement.remove();
  });

  it("should update the observed element's classes on resize when updateResponsiveClasses is true", () => {
    const testEl = document.createElement('div');
    const target = new ElementRef(testEl);

    const service = TestBed.inject(SkyResizeObserverMediaQueryService);

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
    testEl.remove();
  });

  it('should switch observing to a new element', () => {
    const nativeElement1 = document.createElement('div');
    document.body.appendChild(nativeElement1);
    const nativeElement2 = document.createElement('div');
    nativeElement2.style.width = '200px';
    document.body.appendChild(nativeElement2);
    const target1 = new ElementRef(nativeElement1);
    const target2 = new ElementRef(nativeElement2);
    let result: SkyMediaBreakpoints | undefined;
    const service = TestBed.inject(SkyResizeObserverMediaQueryService);
    service.observe(target1);
    const subscription = service.subscribe((breakpoint) => {
      result = breakpoint;
    });
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
    nativeElement1.remove();
    nativeElement2.remove();
  });
});
