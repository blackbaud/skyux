import { Injectable } from '@angular/core';
import { SkyBreakpointObserver, SkyBreakpointType } from '@skyux/core';

import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class SkyBreakpointObserverTesting implements SkyBreakpointObserver {
  public get breakpointChange(): Observable<SkyBreakpointType> {
    return this.#breakpointChangeObs;
  }

  #breakpointChange = new ReplaySubject<SkyBreakpointType>(1);
  #breakpointChangeObs = this.#breakpointChange.asObservable();

  public destroy(): void {
    this.#breakpointChange.complete();
  }

  public setBreakpoint(breakpoint: SkyBreakpointType): void {
    this.#breakpointChange.next(breakpoint);
  }
}
