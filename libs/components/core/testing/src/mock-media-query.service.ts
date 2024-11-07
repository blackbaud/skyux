import { Injectable, NgZone } from '@angular/core';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryListener,
  SkyMediaQueryService,
} from '@skyux/core';

import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * @internal
 * @deprecated Use `provideSkyMediaQueryTesting()` coupled with `SkyMediaQueryTestingController`.
 */
@Injectable()
export class MockSkyMediaQueryService extends SkyMediaQueryService {
  public static override xs = '(max-width: 767px)';
  public static override sm = '(min-width: 768px) and (max-width: 991px)';
  public static override md = '(min-width: 992px) and (max-width: 1199px)';
  public static override lg = '(min-width: 1200px)';

  public override get current(): SkyMediaBreakpoints {
    return this.currentBreakpoints;
  }

  public override set current(breakpoints: SkyMediaBreakpoints) {
    this.currentBreakpoints = breakpoints;
  }

  public currentMockSubject = new BehaviorSubject<SkyMediaBreakpoints>(
    this.current,
  );

  protected currentBreakpoints = SkyMediaBreakpoints.md;

  constructor() {
    super(
      new NgZone({
        enableLongStackTrace: true,
      }),
    );
  }

  public override subscribe(listener: SkyMediaQueryListener): Subscription {
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
  public override destroy(): void {}
}
