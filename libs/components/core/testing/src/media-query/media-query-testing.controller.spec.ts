/* eslint-disable @nx/enforce-module-boundaries */
import { TestBed } from '@angular/core/testing';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

import { SkyMediaQueryTestingController } from './media-query-testing.controller';
import { provideSkyMediaQueryTesting } from './provide-media-query-testing';

describe('media-query-testing.controller', () => {
  let mediaQuerySvc: SkyMediaQueryService;
  let mediaQueryController: SkyMediaQueryTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideSkyMediaQueryTesting()],
    });

    mediaQuerySvc = TestBed.inject(SkyMediaQueryService);
    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
  });

  it('should trigger media query breakpoints', () => {
    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.xs);
    expect(mediaQuerySvc.current).toEqual(SkyMediaBreakpoints.xs);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.sm);
    expect(mediaQuerySvc.current).toEqual(SkyMediaBreakpoints.sm);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.md);
    expect(mediaQuerySvc.current).toEqual(SkyMediaBreakpoints.md);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.lg);
    expect(mediaQuerySvc.current).toEqual(SkyMediaBreakpoints.lg);
  });

  it('should emit breakpoint changes', () => {
    let currentBreakpoint: SkyMediaBreakpoints | undefined;

    mediaQuerySvc.subscribe((breakpoint) => {
      currentBreakpoint = breakpoint;
    });

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.lg);
    expect(currentBreakpoint).toEqual(SkyMediaBreakpoints.lg);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.xs);
    expect(currentBreakpoint).toEqual(SkyMediaBreakpoints.xs);
  });
});
