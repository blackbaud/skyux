import { Injectable } from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryListener } from '@skyux/core';

import { ReplaySubject, Subscription } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyVerticalTabMediaQueryService {
  public current: SkyMediaBreakpoints | undefined;

  #currentSubject: ReplaySubject<SkyMediaBreakpoints>;

  constructor() {
    this.#currentSubject = new ReplaySubject<SkyMediaBreakpoints>(1);
  }

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentSubject.subscribe({
      next: (breakpoints: SkyMediaBreakpoints) => {
        listener(breakpoints);
      },
    });
  }

  public setBreakpointForWidth(width: number): void {
    let breakpoint: SkyMediaBreakpoints;

    if (this.isWidthWithinBreakpoint(width, SkyMediaBreakpoints.xs)) {
      breakpoint = SkyMediaBreakpoints.xs;
    } else if (this.isWidthWithinBreakpoint(width, SkyMediaBreakpoints.sm)) {
      breakpoint = SkyMediaBreakpoints.sm;
    } else if (this.isWidthWithinBreakpoint(width, SkyMediaBreakpoints.md)) {
      breakpoint = SkyMediaBreakpoints.md;
    } else {
      breakpoint = SkyMediaBreakpoints.lg;
    }

    this.current = breakpoint;
    this.#currentSubject.next(this.current);
  }

  public isWidthWithinBreakpoint(
    width: number,
    breakpoint: SkyMediaBreakpoints,
  ): boolean {
    const xsBreakpointMaxPixels = 767;
    const smBreakpointMinPixels = 768;
    const smBreakpointMaxPixels = 991;
    const mdBreakpointMinPixels = 992;
    const mdBreakpointMaxPixels = 1199;
    const lgBreakpointMinPixels = 1200;

    switch (breakpoint) {
      case SkyMediaBreakpoints.xs: {
        return width <= xsBreakpointMaxPixels;
      }
      case SkyMediaBreakpoints.sm: {
        return width >= smBreakpointMinPixels && width <= smBreakpointMaxPixels;
      }
      case SkyMediaBreakpoints.md: {
        return width >= mdBreakpointMinPixels && width <= mdBreakpointMaxPixels;
      }
      default: {
        return width >= lgBreakpointMinPixels;
      }
    }
  }

  public destroy(): void {
    this.#currentSubject.complete();
  }
}
