import { Injectable, inject } from '@angular/core';
import { SkyBreakpoint } from '@skyux/core';

import { firstValueFrom } from 'rxjs';

import { SkyBreakpointObserverTesting } from './breakpoint-observer-testing';

/**
 * A controller to be injected into tests, which mocks the
 * `SkyMediaQueryService` and handles interactions with breakpoints.
 */
@Injectable()
export class SkyMediaQueryTestingController {
  readonly #observer = inject(SkyBreakpointObserverTesting);

  #breakpoint: SkyBreakpoint | undefined;

  /**
   * Throws an error if the current breakpoint does not match the expected breakpoint.
   */
  public async expectBreakpoint(
    expectedBreakpoint: SkyBreakpoint,
  ): Promise<void> {
    if (!this.#breakpoint) {
      throw new Error(
        `A media breakpoint has not been set. Call \`setBreakpoint()\` and try again.`,
      );
    }

    const current = await firstValueFrom(this.#observer.breakpointChange);

    if (expectedBreakpoint !== current) {
      throw new Error(
        `Expected the current media breakpoint to be "${expectedBreakpoint}", but it is "${current}".`,
      );
    }
  }

  /**
   * Emits the provided breakpoint to all subscribers.
   */
  public setBreakpoint(breakpoint: SkyBreakpoint): void {
    this.#breakpoint = breakpoint;
    this.#observer.setBreakpoint(breakpoint);
  }
}
