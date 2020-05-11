import {
  inject,
  TestBed
} from '@angular/core/testing';

import {
  Subscription
} from 'rxjs';

import {
  SkyMediaBreakpoints
} from './media-breakpoints';

import {
  SkyMediaQueryService
} from './media-query.service';

describe('Media query service', () => {
  let mediaQueryListPrototype: any;
  let listenerCount: number;
  let xsListener: Function;
  let smListener: Function;
  let mdListener: Function;
  let lgListener: Function;
  let matchMediaSpy: jasmine.Spy;

  function setUpListeners(): void {
    spyOn(mediaQueryListPrototype, 'addListener')
      .and.callFake((serviceListener: Function) => {
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
      }
    );
  }

  function callBreakpoint(breakpoints: SkyMediaBreakpoints): void {
    xsListener({
      matches: (breakpoints === SkyMediaBreakpoints.xs)
    });

    smListener({
      matches: (breakpoints === SkyMediaBreakpoints.sm)
    });

    mdListener({
      matches: (breakpoints === SkyMediaBreakpoints.md)
    });

    lgListener({
      matches: (breakpoints === SkyMediaBreakpoints.lg)
    });
  }

  describe('initialization test', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SkyMediaQueryService
        ]
      });

      // Safari doesn't put MediaQueryList on the global window object so we
      // have to pick it off here.
      mediaQueryListPrototype = Object.getPrototypeOf(matchMedia(SkyMediaQueryService.sm));

      matchMediaSpy = spyOn(window as any, 'matchMedia').and.callFake((args: string) => {
        if (args === '(max-width: 767px)') {
          return {
            matches: true,
            addListener: () => {
              return;
            },
            removeListener: () => {
              return;
            }
          };
        } else {
          return {
            matches: false,
            addListener: () => { },
            removeListener: () => {
              return;
            }
          };
        }
      });

      setUpListeners();
    });

    afterEach(inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        // Simulate component destruction.
        mediaQueryService.ngOnDestroy();
      }
    ));

    it('should handle initialization properly', inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        let result: SkyMediaBreakpoints;

        const subscription = mediaQueryService.subscribe(
          (args: SkyMediaBreakpoints) => {
            result = args;
          }
        );

        expect(result).toEqual(SkyMediaBreakpoints.xs);

        subscription.unsubscribe();
      }
    ));
  });

  describe('query tests', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SkyMediaQueryService
        ]
      });

      // Safari doesn't put MediaQueryList on the global window object so we
      // have to pick it off here.
      mediaQueryListPrototype = Object.getPrototypeOf(matchMedia(SkyMediaQueryService.sm));

      matchMediaSpy = spyOn(window, 'matchMedia').and.callThrough();
      listenerCount = 0;
      setUpListeners();
    });

    it('should listen for media query breakpoints on init', inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        let result: SkyMediaBreakpoints;

        callBreakpoint(SkyMediaBreakpoints.sm);

        const subscription = mediaQueryService.subscribe(
          (args: SkyMediaBreakpoints) => {
            result = args;
          }
        );

        expect(matchMediaSpy).toHaveBeenCalledWith(SkyMediaQueryService.xs);
        expect(matchMediaSpy).toHaveBeenCalledWith(SkyMediaQueryService.sm);
        expect(matchMediaSpy).toHaveBeenCalledWith(SkyMediaQueryService.md);
        expect(matchMediaSpy).toHaveBeenCalledWith(SkyMediaQueryService.lg);
        expect(result).toEqual(SkyMediaBreakpoints.sm);

        subscription.unsubscribe();
      }
    ));

    it('should stop listening for media query breakpoints on destroy', inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        const removeListenerSpy = spyOn(mediaQueryListPrototype, 'removeListener');
        let subscription: Subscription;

        subscription = mediaQueryService.subscribe(
          (args: SkyMediaBreakpoints) => {

          }
        );

        mediaQueryService.destroy();

        expect(removeListenerSpy.calls.count()).toBe(4);
        expect(subscription.closed).toBe(true);
      }
    ));

    it('should fire the listener when the specified breakpoint is hit', inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        let result: SkyMediaBreakpoints;

        callBreakpoint(SkyMediaBreakpoints.sm);

        const subscription = mediaQueryService.subscribe(
          (args: SkyMediaBreakpoints) => {
            result = args;
          }
        );

        callBreakpoint(SkyMediaBreakpoints.xs);

        expect(result).toEqual(SkyMediaBreakpoints.xs);

        callBreakpoint(SkyMediaBreakpoints.md);

        expect(result).toEqual(SkyMediaBreakpoints.md);

        callBreakpoint(SkyMediaBreakpoints.lg);

        expect(result).toEqual(SkyMediaBreakpoints.lg);

        subscription.unsubscribe();
      }
    ));

    it('should provide the ability to check the current breakpoints', inject(
      [SkyMediaQueryService],
      (mediaQueryService: SkyMediaQueryService) => {
        callBreakpoint(SkyMediaBreakpoints.sm);

        expect(mediaQueryService.current).toEqual(SkyMediaBreakpoints.sm);
      }
    ));
  });
});
