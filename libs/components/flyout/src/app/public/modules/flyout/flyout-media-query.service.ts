import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  Subscription
} from 'rxjs/Subscription';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryListener
} from '@skyux/core';

@Injectable()
export class SkyFlyoutMediaQueryService {

  public get current(): SkyMediaBreakpoints {
    return this._current;
  }

  private currentSubject = new BehaviorSubject<SkyMediaBreakpoints>(this.current);

  private _current = SkyMediaBreakpoints.xs;

  constructor() {
    this.currentSubject.next(this._current);
  }

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.currentSubject.subscribe({
      next: (breakpoints: SkyMediaBreakpoints) => {
        listener(breakpoints);
      }
    });
  }

  public setBreakpointForWidth(width: number): void {
    let breakpoint: SkyMediaBreakpoints;

    if (this.isWidthWithinBreakpiont(width, SkyMediaBreakpoints.xs)) {
      breakpoint = SkyMediaBreakpoints.xs;
    } else if (this.isWidthWithinBreakpiont(width, SkyMediaBreakpoints.sm)) {
      breakpoint = SkyMediaBreakpoints.sm;
    } else if (this.isWidthWithinBreakpiont(width, SkyMediaBreakpoints.md)) {
      breakpoint = SkyMediaBreakpoints.md;
    } else {
      breakpoint = SkyMediaBreakpoints.lg;
    }

    this._current = breakpoint;
    this.currentSubject.next(this._current);
  }

  public isWidthWithinBreakpiont(width: number, breakpoint: SkyMediaBreakpoints): boolean {
    const xsBreakpointMaxPixels = 767;
    const smBreakpointMinPixels = 768;
    const smBreakpointMaxPixels = 991;
    const mdBreakpointMinPixels = 992;
    const mdBreakpointMaxPixels = 1199;
    const lgBreakpointMinPixels = 1200;

    switch (breakpoint) {
      case SkyMediaBreakpoints.xs: {
        return (width <= xsBreakpointMaxPixels);
      }
      case SkyMediaBreakpoints.sm: {
        return (width >= smBreakpointMinPixels && width <= smBreakpointMaxPixels);
      }
      case SkyMediaBreakpoints.md: {
        return (width >= mdBreakpointMinPixels && width <= mdBreakpointMaxPixels);
      }
      default: {
        return (width >= lgBreakpointMinPixels);
      }
    }
  }

  public destroy(): void {
    this.currentSubject.complete();
  }
}
