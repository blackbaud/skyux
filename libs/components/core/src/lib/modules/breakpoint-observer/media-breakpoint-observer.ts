import { Injectable, OnDestroy } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { SkyBreakpoint } from './breakpoint';
import { SkyBreakpointObserver } from './breakpoint-observer';

const QUERIES = new Map<SkyBreakpoint, string>([
  ['xs', '(max-width: 767px)'],
  ['sm', '(min-width: 768px) and (max-width: 991px)'],
  ['md', '(min-width: 992px) and (max-width: 1199px)'],
  ['lg', '(min-width: 1200px)'],
]);

/**
 * Emits when the viewport width changes.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyMediaBreakpointObserver
  implements OnDestroy, SkyBreakpointObserver
{
  public get breakpointChange(): Observable<SkyBreakpoint> {
    return this.#breakpointChangeObs;
  }

  readonly #breakpointChange = new ReplaySubject<SkyBreakpoint>(1);
  readonly #breakpointChangeObs = this.#breakpointChange.asObservable();

  #listeners = new Map<MediaQueryList, (evt: MediaQueryListEvent) => void>();

  constructor() {
    for (const [breakpoint, query] of QUERIES.entries()) {
      const mq = matchMedia(query);

      const listener = (evt: MediaQueryListEvent): void => {
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

  public ngOnDestroy(): void {
    this.destroy();
  }

  public destroy(): void {
    this.#breakpointChange.complete();

    for (const [query, listener] of this.#listeners.entries()) {
      query.removeEventListener('change', listener);
    }

    this.#listeners.clear();
  }

  #notifyBreakpointChange(breakpoint: SkyBreakpoint): void {
    this.#breakpointChange.next(breakpoint);
  }
}
