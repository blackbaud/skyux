import { Injectable } from '@angular/core';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryListener,
  SkyMediaQueryService,
} from '@skyux/core';

import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * Internal media query service for use determining the media query size of the split view workspace.
 * @internal
 */
@Injectable()
export class SkySplitViewMediaQueryService extends SkyMediaQueryService {
  public override get current(): SkyMediaBreakpoints {
    return this.#_current;
  }

  #_current = SkyMediaBreakpoints.xs;
  #currentSubject = new BehaviorSubject<SkyMediaBreakpoints>(this.#_current);

  public override subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentSubject.subscribe({
      next: (breakpoints: SkyMediaBreakpoints) => {
        listener(breakpoints);
      },
    });
  }

  public setBreakpointForWidth(width: number | undefined): void {
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

    this.#_current = breakpoint;
    this.#currentSubject.next(this.#_current);
  }

  public isWidthWithinBreakpoint(
    width: number | undefined,
    breakpoint: SkyMediaBreakpoints,
  ): boolean {
    if (width === undefined) {
      return false;
    }

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

  public override destroy(): void {
    this.#currentSubject.complete();
  }
}
