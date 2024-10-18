import {
  ElementRef,
  Injectable,
  OnDestroy,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, ReplaySubject } from 'rxjs';

import { SkyResizeObserverService } from '../resize-observer/resize-observer.service';

import { SkyBreakpoint } from './breakpoint';
import { SkyBreakpointObserver } from './breakpoint-observer';

const QUERIES = new Map<SkyBreakpoint, (width: number) => boolean>([
  ['xs', (w): boolean => w > 0 && w <= 767],
  ['sm', (w): boolean => w > 767 && w <= 991],
  ['md', (w): boolean => w > 991 && w <= 1199],
  ['lg', (w): boolean => w > 1199],
]);

/**
 * Emits when the width of the host container changes.
 * @internal
 */
@Injectable()
export class SkyContainerBreakpointObserver
  implements OnDestroy, SkyBreakpointObserver
{
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

    afterNextRender(() => {
      this.#checkWidth();
    });
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  public destroy(): void {
    this.#breakpointChange.complete();
  }

  #checkBreakpoint(width: number): void {
    for (const [breakpoint, check] of QUERIES.entries()) {
      if (breakpoint !== this.#breakpoint && check(width)) {
        this.#breakpoint = breakpoint;
        this.#notifyBreakpointChange(breakpoint);
        break;
      }
    }
  }

  #checkWidth(): void {
    const width =
      (this.#elementRef.nativeElement as HTMLElement).offsetWidth ?? 0;

    this.#checkBreakpoint(width);
  }

  #notifyBreakpointChange(breakpoint: SkyBreakpoint): void {
    this.#breakpointChange.next(breakpoint);
  }
}
