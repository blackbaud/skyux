import { Injectable, NgZone, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';

import {
  SkyMediaBreakpointType,
  toSkyMediaBreakpointType,
} from './media-breakpoint-type';
import {
  SKY_MEDIA_BREAKPOINT_DEFAULT,
  SkyMediaBreakpoints,
} from './media-breakpoints';
import { SkyMediaQueryListener } from './media-query-listener';
import { SkyMediaQueryServiceInterface } from './media-query-service-interface';

@Injectable({
  providedIn: 'root',
})
export class SkyMediaQueryService
  implements OnDestroy, SkyMediaQueryServiceInterface
{
  /**
   * The size for the `xs` breakpoint.
   * @default "(max-width: 767px)"
   */
  public static xs = '(max-width: 767px)';

  /**
   * The size for the `sm` breakpoint.
   * @default "(min-width: 768px) and (max-width: 991px)"
   */
  public static sm = '(min-width: 768px) and (max-width: 991px)';

  /**
   * The size for the `md` breakpoint.
   * @default "(min-width: 992px) and (max-width: 1199px)"
   */
  public static md = '(min-width: 992px) and (max-width: 1199px)';

  /**
   * The size for the `lg` breakpoint.
   * @default "(min-width: 1200px)"
   */
  public static lg = '(min-width: 1200px)';

  /**
   * Emits when the breakpoint changes.
   */
  public get breakpointChange(): Observable<SkyMediaBreakpointType> {
    return this.#breakpointChangeObs;
  }

  /**
   * Returns the current breakpoint.
   * @deprecated Subscribe to the `breakpointChange` observable instead.
   */
  public get current(): SkyMediaBreakpoints {
    return this.#currentBreakpoint;
  }

  #currentSubject = new BehaviorSubject<SkyMediaBreakpoints>(
    SKY_MEDIA_BREAKPOINT_DEFAULT,
  );

  #breakpointChange = new ReplaySubject<SkyMediaBreakpointType>(1);
  #breakpointChangeObs = this.#breakpointChange.asObservable();
  #currentBreakpoint = SKY_MEDIA_BREAKPOINT_DEFAULT;

  #breakpoints: {
    mediaQueryString: string;
    name: SkyMediaBreakpoints;
  }[] = [
    {
      mediaQueryString: SkyMediaQueryService.xs,
      name: SkyMediaBreakpoints.xs,
    },
    {
      mediaQueryString: SkyMediaQueryService.sm,
      name: SkyMediaBreakpoints.sm,
    },
    {
      mediaQueryString: SkyMediaQueryService.md,
      name: SkyMediaBreakpoints.md,
    },
    {
      mediaQueryString: SkyMediaQueryService.lg,
      name: SkyMediaBreakpoints.lg,
    },
  ];

  #mediaQueries: {
    mediaQueryList: MediaQueryList;
    listener: (event: any) => void;
  }[] = [];

  #zone: NgZone;

  constructor(zone: NgZone) {
    this.#zone = zone;
    this.#addListeners();
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * Subscribes to screen size changes.
   * @param listener Specifies a function that is called when breakpoints change.
   * @deprecated Subscribe to the `breakpointChange` observable instead.
   */
  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentSubject.subscribe({
      next: (breakpoints: SkyMediaBreakpoints) => {
        listener(breakpoints);
      },
    });
  }

  /**
   * @internal
   */
  public destroy(): void {
    this.#removeListeners();
    this.#currentSubject.complete();
    this.#breakpointChange.complete();
  }

  #addListeners(): void {
    this.#mediaQueries = this.#breakpoints.map((breakpoint) => {
      const mq = matchMedia(breakpoint.mediaQueryString);

      const listener = (event: MediaQueryListEvent) => {
        // Run the check outside of Angular's change detection since Angular
        // does not wrap matchMedia listeners in NgZone.
        // See: https://blog.assaf.co/angular-2-change-detection-zones-and-an-example/
        this.#zone.run(() => {
          if (event.matches) {
            this.#notifyBreakpointChange(breakpoint.name);
          }
        });
      };

      mq.addListener(listener);

      if (mq.matches) {
        this.#notifyBreakpointChange(breakpoint.name);
      }

      return {
        mediaQueryList: mq,
        listener,
      };
    });
  }

  #removeListeners(): void {
    this.#mediaQueries.forEach((mediaQuery) => {
      mediaQuery.mediaQueryList.removeListener(mediaQuery.listener);
    });
    this.#mediaQueries = [];
  }

  #notifyBreakpointChange(breakpoint: SkyMediaBreakpoints): void {
    this.#currentBreakpoint = breakpoint;
    this.#currentSubject.next(breakpoint);

    const breakpointType = toSkyMediaBreakpointType(breakpoint);
    this.#breakpointChange.next(breakpointType);
  }
}
