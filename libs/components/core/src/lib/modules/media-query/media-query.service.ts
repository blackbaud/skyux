import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, Subscription } from 'rxjs';

import { SkyBreakpointType } from './breakpoint-observers/breakpoint-type';
import { toSkyMediaBreakpoints } from './breakpoint-observers/breakpoint-utils';
import { SkyMediaBreakpointObserver } from './breakpoint-observers/media-breakpoint-observer';
import { SkyMediaBreakpoints } from './media-breakpoints';
import { SkyMediaQueryListener } from './media-query-listener';

const DEFAULT_BREAKPOINT = SkyMediaBreakpoints.md;

@Injectable({
  providedIn: 'root',
})
export class SkyMediaQueryService implements OnDestroy {
  readonly #breakpointObserver = inject(SkyMediaBreakpointObserver);
  public observer = this.#breakpointObserver;

  /**
   * Emits when the breakpoint changes.
   */
  public get breakpointChange(): Observable<SkyBreakpointType> {
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
    return this.#currentBreakpoint;
  }

  #currentBreakpoint = DEFAULT_BREAKPOINT;

  // Keep NgZone as a constructor param so that consumer mocks don't throw typing errors.
  constructor(_zone?: NgZone) {
    this.#breakpointObserver.breakpointChange
      .pipe(takeUntilDestroyed())
      .subscribe((breakpoint) => {
        this.#currentBreakpoint = toSkyMediaBreakpoints(breakpoint);
      });
  }

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
      next: (breakpoint: SkyBreakpointType) => {
        listener(toSkyMediaBreakpoints(breakpoint));
      },
    });
  }
}
