import { Injectable, inject } from '@angular/core';
import { SkyBreakpoint } from '@skyux/core';

import { SkyBreakpointObserverTesting } from './breakpoint-observer-testing';

/**
 * A controller to be injected into tests, which mocks the
 * `SkyMediaQueryService` and handles interactions with breakpoints.
 */
@Injectable()
export class SkyMediaQueryTestingController {
  readonly #observer = inject(SkyBreakpointObserverTesting);

  /**
   * Emits the provided breakpoint to all subscribers.
   */
  public setBreakpoint(breakpoint: SkyBreakpoint): void {
    this.#observer.setBreakpoint(breakpoint);
  }
}
