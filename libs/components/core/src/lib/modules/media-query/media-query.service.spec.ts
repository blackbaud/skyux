import { TestBed, inject } from '@angular/core/testing';

import { SkyBreakpoint } from '../breakpoint-observer/breakpoint';
import { SkyMediaBreakpointObserver } from '../breakpoint-observer/media-breakpoint-observer';

import { SkyMediaBreakpoints } from './media-breakpoints';
import { SkyMediaQueryService } from './media-query.service';

describe('Media query service', () => {
  let mediaQueryListPrototype: any;
  let listenerCount: number;
  let xsListener: (args: { matches: boolean }) => void;
  let smListener: (args: { matches: boolean }) => void;
  let mdListener: (args: { matches: boolean }) => void;
  let lgListener: (args: { matches: boolean }) => void;
  let matchMediaSpy: jasmine.Spy;

  function setUpListeners(): void {
    spyOn(mediaQueryListPrototype, 'addEventListener').and.callFake(
      (
        _evtName: string,
        serviceListener: (args: { matches: boolean }) => void,
      ) => {
        if (listenerCount === 0) {
          xsListener = serviceListener;
        } else if (listenerCount === 1) {
          smListener = serviceListener;
        } else if (listenerCount === 2) {
          mdListener = serviceListener;
        } else if (listenerCount === 3) {
          lgListener = serviceListener;
        }

        listenerCount++;
      },
    );
  }

  function callBreakpoint(breakpoints: SkyMediaBreakpoints): void {
    xsListener({
      matches: breakpoints === SkyMediaBreakpoints.xs,
    });

    smListener({
      matches: breakpoints === SkyMediaBreakpoints.sm,
    });

    mdListener({
      matches: breakpoints === SkyMediaBreakpoints.md,
    });

    lgListener({
      matches: breakpoints === SkyMediaBreakpoints.lg,
    });
  }

  describe('initialization test', () => {
    beforeEach(() => {
      // Safari doesn't put MediaQueryList on the global window object so we
      // have to pick it off here.
      mediaQueryListPrototype = Object.getPrototypeOf(
        matchMedia(SkyMediaQueryService.sm),
      );

      matchMediaSpy = spyOn(window as any, 'matchMedia').and.callFake(
        (args: string) => {
          if (args === '(max-width: 767px)') {
            return {
              matches: true,
              addEventListener: () => {
                return;
              },
              removeEventListener: () => {
                return;
              },
            };
          } else {
            return {
              matches: false,
              addEventListener: () => {},
              removeEventListener: () => {
                return;
              },
            };
          }
        },
      );

      setUpListeners();
    });

    afterEach(inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        // Simulate component destruction.
        mediaQueryService.ngOnDestroy();
      },
    ));

    it('should handle initialization properly', inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        let result: SkyMediaBreakpoints | undefined;

        const subscription = mediaQueryService.subscribe((args) => {
          result = args;
        });

        expect(result).toEqual(SkyMediaBreakpoints.xs);

        subscription.unsubscribe();
      },
    ));
  });

  describe('query tests', () => {
    beforeEach(() => {
      // Safari doesn't put MediaQueryList on the global window object so we
      // have to pick it off here.
      mediaQueryListPrototype = Object.getPrototypeOf(
        matchMedia(SkyMediaQueryService.sm),
      );

      matchMediaSpy = spyOn(window, 'matchMedia').and.callThrough();
      listenerCount = 0;
      setUpListeners();
    });

    it('should listen for media query breakpoints on init', inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        let result: SkyMediaBreakpoints | undefined;

        callBreakpoint(SkyMediaBreakpoints.sm);

        const subscription = mediaQueryService.subscribe((args) => {
          result = args;
        });

        expect(matchMediaSpy).toHaveBeenCalledWith(SkyMediaQueryService.xs);
        expect(matchMediaSpy).toHaveBeenCalledWith(SkyMediaQueryService.sm);
        expect(matchMediaSpy).toHaveBeenCalledWith(SkyMediaQueryService.md);
        expect(matchMediaSpy).toHaveBeenCalledWith(SkyMediaQueryService.lg);
        expect(result).toEqual(SkyMediaBreakpoints.sm);

        subscription.unsubscribe();
      },
    ));

    it('should call the breakpoint observer `destroy` method', () => {
      const destroySpy = spyOn(
        TestBed.inject(SkyMediaBreakpointObserver),
        'destroy',
      );

      TestBed.inject(SkyMediaQueryService).destroy();

      expect(destroySpy).toHaveBeenCalledTimes(1);
    });

    it('should fire the listener when the specified breakpoint is hit', inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        let result: SkyMediaBreakpoints | undefined;

        callBreakpoint(SkyMediaBreakpoints.sm);

        const subscription = mediaQueryService.subscribe((args) => {
          result = args;
        });

        callBreakpoint(SkyMediaBreakpoints.xs);

        expect(result).toEqual(SkyMediaBreakpoints.xs);

        callBreakpoint(SkyMediaBreakpoints.md);

        expect(result).toEqual(SkyMediaBreakpoints.md);

        callBreakpoint(SkyMediaBreakpoints.lg);

        expect(result).toEqual(SkyMediaBreakpoints.lg);

        subscription.unsubscribe();
      },
    ));

    it('should emit when the breakpoint changes', () => {
      const mediaQuerySvc = TestBed.inject(SkyMediaQueryService);

      let result: SkyBreakpoint | undefined;

      const subscription = mediaQuerySvc.breakpointChange.subscribe(
        (breakpoint) => {
          result = breakpoint;
        },
      );

      callBreakpoint(SkyMediaBreakpoints.xs);
      expect(result).toEqual('xs');

      callBreakpoint(SkyMediaBreakpoints.md);
      expect(result).toEqual('md');

      callBreakpoint(SkyMediaBreakpoints.lg);
      expect(result).toEqual('lg');

      subscription.unsubscribe();
    });

    it('should provide the ability to check the current breakpoints', inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        callBreakpoint(SkyMediaBreakpoints.sm);

        expect(mediaQueryService.current).toEqual(SkyMediaBreakpoints.sm);
      },
    ));
  });
});
