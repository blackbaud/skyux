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

const QUERIES: [SkyBreakpoint, (width: number) => boolean][] = [
  ['xs', (width): boolean => width > 0 && width <= 767],
  ['sm', (width): boolean => width > 767 && width <= 991],
  ['md', (width): boolean => width > 991 && width <= 1199],
  ['lg', (width): boolean => width > 1199],
];

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
    for (const [breakpoint, check] of QUERIES) {
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
