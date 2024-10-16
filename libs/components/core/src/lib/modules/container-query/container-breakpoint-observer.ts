import { ElementRef, Injectable, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, ReplaySubject } from 'rxjs';

import { SkyBreakpointObserver } from '../media-query/breakpoint-observers/breakpoint-observer';
import { SkyBreakpointType } from '../media-query/breakpoint-observers/breakpoint-type';
import { SkyResizeObserverService } from '../resize-observer/resize-observer.service';

const QUERIES = new Map<SkyBreakpointType, (width: number) => boolean>([
  ['xs', (w) => w > 0 && w <= 767],
  ['sm', (w) => w > 767 && w <= 991],
  ['md', (w) => w > 991 && w <= 1199],
  ['lg', (w) => w > 1199],
]);

/**
 * Emits changes to the width of the host container.
 * @internal
 */
@Injectable()
export class SkyContainerBreakpointObserver implements SkyBreakpointObserver {
  readonly #elementRef = inject(ElementRef);
  readonly #resizeObserver = inject(SkyResizeObserverService);

  public get breakpointChange(): Observable<SkyBreakpointType> {
    return this.#breakpointChangeObs;
  }

  readonly #breakpointChange = new ReplaySubject<SkyBreakpointType>(1);
  readonly #breakpointChangeObs = this.#breakpointChange
    .asObservable()
    .pipe(takeUntilDestroyed());

  constructor() {
    this.#resizeObserver
      .observe(this.#elementRef)
      .pipe(takeUntilDestroyed())
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
      if (check(width)) {
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
