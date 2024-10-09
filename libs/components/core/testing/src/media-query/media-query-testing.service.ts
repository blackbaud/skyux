/* eslint-disable @nx/enforce-module-boundaries */
import { ElementRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryListener,
  SkyMediaQueryServiceOverride,
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';

import { BehaviorSubject, Subscription } from 'rxjs';

import { SkyMediaQueryTestingController } from './media-query-testing.controller';

const DEFAULT_BREAKPOINT = SkyMediaBreakpoints.md;

/**
 * @internal
 */
@Injectable({ providedIn: 'root' })
export class SkyMediaQueryTestingService
  implements SkyMediaQueryServiceOverride, SkyMediaQueryTestingController
{
  public get current(): SkyMediaBreakpoints {
    return this.#currentBreakpoint;
  }

  #currentBreakpoint = DEFAULT_BREAKPOINT;
  #currentBreakpointChange = new BehaviorSubject<SkyMediaBreakpoints>(
    DEFAULT_BREAKPOINT,
  );

  #currentBreakpointObs = this.#currentBreakpointChange
    .asObservable()
    .pipe(takeUntilDestroyed());

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentBreakpointObs.subscribe({
      next: (breakpoint) => {
        listener(breakpoint);
      },
    });
  }

  /* istanbul ignore next */
  public destroy(): void {
    /* noop */
  }

  public setBreakpoint(breakpoint: SkyMediaBreakpoints): void {
    this.#currentBreakpoint = breakpoint;
    this.#currentBreakpointChange.next(breakpoint);
  }

  /* istanbul ignore next */
  public observe(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _element: ElementRef,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options?: { updateResponsiveClasses?: boolean },
  ): SkyResizeObserverMediaQueryService {
    /* noop */
    return this as unknown as SkyResizeObserverMediaQueryService;
  }

  /* istanbul ignore next */
  public unobserve(): void {
    /* noop */
  }
}
