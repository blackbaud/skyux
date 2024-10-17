import { ElementRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, ReplaySubject } from 'rxjs';

import { SkyResizeObserverService } from '../../resize-observer/resize-observer.service';

import { SkyBreakpoint } from './breakpoint';
import { SkyBreakpointObserver } from './breakpoint-observer';

const QUERIES = new Map<SkyBreakpoint, (width: number) => boolean>([
  ['xs', (w) => w > 0 && w <= 767],
  ['sm', (w) => w > 767 && w <= 991],
  ['md', (w) => w > 991 && w <= 1199],
  ['lg', (w) => w > 1199],
]);

/**
 * Emits when the width of the host container changes.
 * @internal
 */
@Injectable()
export class SkyContainerBreakpointObserver implements SkyBreakpointObserver {
  readonly #elementRef = inject(ElementRef);
  readonly #resizeObserver = inject(SkyResizeObserverService);

  public get breakpointChange(): Observable<SkyBreakpoint> {
    return this.#breakpointChangeObs;
  }

  #breakpoint: SkyBreakpoint | undefined;
  readonly #breakpointChange = new ReplaySubject<SkyBreakpoint>(1);
  readonly #breakpointChangeObs = this.#breakpointChange.asObservable();

  constructor() {
    this.#resizeObserver
      .observe(this.#elementRef)
      .pipe(takeUntilDestroyed())
      .subscribe((entry) => {
        this.#checkBreakpoint(entry.contentRect.width);
      });
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  public destroy(): void {
    this.#breakpointChange.complete();
  }

  #checkBreakpoint(width: number) {
    for (const [breakpoint, check] of QUERIES.entries()) {
      if (breakpoint !== this.#breakpoint && check(width)) {
        this.#breakpoint = breakpoint;
        this.#notifyBreakpointChange(breakpoint);
        break;
      }
    }
  }

  #notifyBreakpointChange(breakpoint: SkyBreakpoint): void {
    this.#breakpointChange.next(breakpoint);
  }
}
