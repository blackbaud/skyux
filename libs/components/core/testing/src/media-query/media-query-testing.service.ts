/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryListener,
  SkyMediaQueryService,
} from '@skyux/core';

import { BehaviorSubject, Subscription } from 'rxjs';

import { SkyMediaQueryTestingController } from './media-query-testing.controller';

/**
 * @internal
 */
@Injectable({ providedIn: 'root' })
export class SkyMediaQueryTestingService
  extends SkyMediaQueryService
  implements SkyMediaQueryTestingController
{
  public override get current(): SkyMediaBreakpoints {
    return this.#currentBreakpoint;
  }

  #currentBreakpoint = SkyMediaBreakpoints.md;
  #currentBreakpointChange = new BehaviorSubject<SkyMediaBreakpoints>(
    this.#currentBreakpoint,
  );

  #currentBreakpointObs =
    this.#currentBreakpointChange.pipe(takeUntilDestroyed());

  public override subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentBreakpointObs.subscribe({
      next: (breakpoint) => {
        listener(breakpoint);
      },
    });
  }

  public override destroy(): void {
    /* noop */
  }

  public setBreakpoint(breakpoint: SkyMediaBreakpoints): void {
    this.#currentBreakpoint = breakpoint;
    this.#currentBreakpointChange.next(breakpoint);
  }
}
