import { Injectable, NgZone } from '@angular/core';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryListener,
  SkyMediaQueryService,
} from '@skyux/core';

import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class MockSkyMediaQueryService extends SkyMediaQueryService {
  public static xs = '(max-width: 767px)';
  public static sm = '(min-width: 768px) and (max-width: 991px)';
  public static md = '(min-width: 992px) and (max-width: 1199px)';
  public static lg = '(min-width: 1200px)';

  public get current(): SkyMediaBreakpoints {
    return this.currentBreakpoints;
  }

  public set current(breakpoints: SkyMediaBreakpoints) {
    this.currentBreakpoints = breakpoints;
  }

  public currentMockSubject = new BehaviorSubject<SkyMediaBreakpoints>(
    this.current
  );

  protected currentBreakpoints = SkyMediaBreakpoints.md;

  constructor() {
    super(
      new NgZone({
        enableLongStackTrace: true,
      })
    );
  }

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.currentMockSubject.subscribe({
      next: (breakpoints: SkyMediaBreakpoints) => {
        listener(breakpoints);
      },
    });
  }

  public fire(args: SkyMediaBreakpoints): void {
    this.currentBreakpoints = args;
    this.currentMockSubject.next(this.currentBreakpoints);
  }

  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public destroy(): void {}
}
