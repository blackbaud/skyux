import { Injectable, NgZone } from '@angular/core';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryListener,
  SkyMediaQueryService,
} from '@skyux/core';

import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable()
export class MockSkyMediaQueryService extends SkyMediaQueryService {
  public static xs = '(max-width: 767px)';
  public static sm = '(min-width: 768px) and (max-width: 991px)';
  public static md = '(min-width: 992px) and (max-width: 1199px)';
  public static lg = '(min-width: 1200px)';

  public get current(): SkyMediaBreakpoints {
    return this._currentBreakpoints;
  }

  public set current(breakpoints: SkyMediaBreakpoints) {
    this._currentBreakpoints = breakpoints;
  }

  public currentMockSubject = new BehaviorSubject<SkyMediaBreakpoints>(
    this.current
  );

  private _currentBreakpoints = SkyMediaBreakpoints.md;

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
    this._currentBreakpoints = args;
    this.currentMockSubject.next(this._currentBreakpoints);
  }

  public destroy(): void {}
}
