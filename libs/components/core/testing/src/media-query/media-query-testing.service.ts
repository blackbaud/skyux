/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryListener,
  SkyMediaQueryService,
} from '@skyux/core';

import { BehaviorSubject, Subscription } from 'rxjs';

import { SkyMediaQueryTestingController } from './media-query-testing.controller';

const DEFAULT_BREAKPOINT = SkyMediaBreakpoints.md;

/**
 * @internal
 */
@Injectable({ providedIn: 'root' })
export class SkyMediaQueryTestingService
  extends SkyMediaQueryService
  implements OnDestroy, SkyMediaQueryTestingController
{
  public override get current(): SkyMediaBreakpoints {
    return this.#currentBreakpoint;
  }

  #currentBreakpoint = DEFAULT_BREAKPOINT;
  #currentBreakpointChange = new BehaviorSubject<SkyMediaBreakpoints>(
    this.#currentBreakpoint,
  );

  #currentBreakpointObs = this.#currentBreakpointChange
    .asObservable()
    .pipe(takeUntilDestroyed());

  public override ngOnDestroy(): void {
    this.#currentBreakpoint = DEFAULT_BREAKPOINT;
    this.#currentBreakpointChange.complete();
  }

  public override subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentBreakpointObs.subscribe({
      next: (breakpoint) => {
        listener(breakpoint);
      },
    });
  }

  /* istanbul ignore next */
  public override destroy(): void {
    /* noop */
  }

  public setBreakpoint(breakpoint: SkyMediaBreakpoints): void {
    this.#currentBreakpoint = breakpoint;
    this.#currentBreakpointChange.next(breakpoint);
  }
}
