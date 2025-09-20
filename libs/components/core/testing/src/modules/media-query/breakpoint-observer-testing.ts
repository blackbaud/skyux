import { Injectable } from '@angular/core';
import { SkyBreakpoint, SkyBreakpointObserver } from '@skyux/core';

import { Observable, ReplaySubject } from 'rxjs';

/**
 * Overrides the media and container breakpoint observers for testing.
 * @internal
 */
@Injectable()
export class SkyBreakpointObserverTesting implements SkyBreakpointObserver {
  public get breakpointChange(): Observable<SkyBreakpoint> {
    return this.#breakpointChangeObs;
  }

  #breakpointChange = new ReplaySubject<SkyBreakpoint>(1);
  #breakpointChangeObs = this.#breakpointChange.asObservable();

  public destroy(): void {
    this.#breakpointChange.complete();
  }

  public setBreakpoint(breakpoint: SkyBreakpoint): void {
    this.#breakpointChange.next(breakpoint);
  }
}
