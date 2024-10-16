import { Injectable, inject } from '@angular/core';
import { SkyBreakpointType } from '@skyux/core';

import { firstValueFrom } from 'rxjs';

import { SkyBreakpointObserverTesting } from './breakpoint-observer-testing';

@Injectable()
export class SkyMediaQueryTestingController {
  readonly #observer = inject(SkyBreakpointObserverTesting);

  #breakpoint: SkyBreakpointType | undefined;

  /**
   * Throws an error if the current breakpoint does not match the expected breakpoint.
   */
  public async expectBreakpoint(
    expectedBreakpoint: SkyBreakpointType,
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

  public setBreakpoint(breakpoint: SkyBreakpointType): void {
    this.#breakpoint = breakpoint;
    this.#observer.setBreakpoint(breakpoint);
  }
}
