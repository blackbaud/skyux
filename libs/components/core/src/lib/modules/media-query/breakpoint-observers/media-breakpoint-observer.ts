import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { SkyBreakpointObserver } from './breakpoint-observer';
import { SkyBreakpointType } from './breakpoint-type';

const QUERIES = new Map<SkyBreakpointType, string>([
  ['xs', '(max-width: 767px)'],
  ['sm', '(min-width: 768px) and (max-width: 991px)'],
  ['md', '(min-width: 992px) and (max-width: 1199px)'],
  ['lg', '(min-width: 1200px)'],
]);

/**
 * Emits changes to the width of the viewport.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyMediaBreakpointObserver implements SkyBreakpointObserver {
  public get breakpointChange(): Observable<SkyBreakpointType> {
    return this.#breakpointChangeObs;
  }

  readonly #breakpointChange = new ReplaySubject<SkyBreakpointType>(1);
  readonly #breakpointChangeObs = this.#breakpointChange.asObservable();

  #listeners = new Map<MediaQueryList, (evt: MediaQueryListEvent) => void>();

  constructor() {
    for (const [breakpoint, query] of QUERIES.entries()) {
      const mq = matchMedia(query);

      const listener = (evt: MediaQueryListEvent) => {
        if (evt.matches) {
          this.#notifyBreakpointChange(breakpoint);
        }
      };

      mq.addEventListener('change', listener);

      if (mq.matches) {
        this.#notifyBreakpointChange(breakpoint);
      }

      this.#listeners.set(mq, listener);
    }
  }

  public destroy(): void {
    this.#breakpointChange.complete();
  }

  #notifyBreakpointChange(breakpoint: SkyBreakpointType): void {
    this.#breakpointChange.next(breakpoint);
  }
}
