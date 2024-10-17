import { ElementRef, Injectable, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, ReplaySubject, distinctUntilChanged } from 'rxjs';

import { SkyResizeObserverService } from '../../resize-observer/resize-observer.service';

import { SkyBreakpointObserver } from './breakpoint-observer';
import { SkyBreakpointType } from './breakpoint-type';

const QUERIES = new Map<SkyBreakpointType, (width: number) => boolean>([
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

  public get breakpointChange(): Observable<SkyBreakpointType> {
    return this.#breakpointChangeObs;
  }

  #breakpoint: SkyBreakpointType | undefined;
  readonly #breakpointChange = new ReplaySubject<SkyBreakpointType>(1);
  readonly #breakpointChangeObs = this.#breakpointChange
    .asObservable()
    .pipe(takeUntilDestroyed());

  constructor() {
    this.#resizeObserver
      .observe(this.#elementRef)
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe((entry) => {
        this.#checkBreakpoint(entry.contentRect.width);
      });

    afterNextRender(() => {
      this.#checkWidth(this.#elementRef);
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

  #checkWidth(el: ElementRef): void {
    const width = (el.nativeElement as HTMLElement).offsetWidth ?? 0;
    this.#checkBreakpoint(width);
  }

  #notifyBreakpointChange(breakpoint: SkyBreakpointType): void {
    this.#breakpointChange.next(breakpoint);
  }
}
