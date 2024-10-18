import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Observable, Subscription, map } from 'rxjs';

import { SkyBreakpoint } from '../breakpoint-observer/breakpoint';
import { toSkyMediaBreakpoints } from '../breakpoint-observer/breakpoint-utils';
import { SkyMediaBreakpointObserver } from '../breakpoint-observer/media-breakpoint-observer';

import { SkyMediaBreakpoints } from './media-breakpoints';
import { SkyMediaQueryListener } from './media-query-listener';

const DEFAULT_BREAKPOINT = SkyMediaBreakpoints.md;

/**
 * Utility used to subscribe to viewport and container breakpoint changes.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyMediaQueryService implements OnDestroy {
  readonly #breakpointObserver = inject(SkyMediaBreakpointObserver);

  /**
   * Emits when the breakpoint changes.
   */
  public get breakpointChange(): Observable<SkyBreakpoint> {
    return this.#breakpointObserver.breakpointChange;
  }

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
   * Returns the current breakpoint.
   * @deprecated Subscribe to the `breakpointChange` observable instead.
   */
  public get current(): SkyMediaBreakpoints {
    return this.#currentBreakpoint();
  }

  #currentBreakpoint = toSignal(
    this.#breakpointObserver.breakpointChange.pipe(
      map((breakpoint) => toSkyMediaBreakpoints(breakpoint)),
    ),
    {
      initialValue: DEFAULT_BREAKPOINT,
    },
  );

  // Keep NgZone as a constructor param so that consumer mocks don't encounter typing errors.
  constructor(_zone?: NgZone) {}

  public ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * @internal
   */
  public destroy(): void {
    this.#breakpointObserver.destroy();
  }

  /**
   * Subscribes to screen size changes.
   * @param listener Specifies a function that is called when breakpoints change.
   * @deprecated Subscribe to the `breakpointChange` observable instead.
   */
  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#breakpointObserver.breakpointChange.subscribe({
      next: (breakpoint: SkyBreakpoint) => {
        listener(toSkyMediaBreakpoints(breakpoint));
      },
    });
  }
}
