import { ElementRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, ReplaySubject } from 'rxjs';

import { SkyBreakpointObserver } from './breakpoint-observer';
import { SkyBreakpointType } from './breakpoint-type';

// import { SkyContainerBreakpointObserverAdapterService } from './container-breakpoint-observer-adapter.service';

const QUERIES = new Map<SkyBreakpointType, (width: number) => boolean>([
  ['xs', (x) => x > 0 && x <= 767],
  ['sm', (x) => x > 767 && x <= 991],
  ['md', (x) => x > 991 && x <= 1199],
  ['lg', (x) => x > 1199],
]);

/**
 * Emits changes to the width of the host container.
 * @internal
 */
@Injectable()
export class SkyContainerBreakpointObserver implements SkyBreakpointObserver {
  // readonly #adapter = inject(SkyContainerBreakpointObserverAdapterService);
  readonly #elementRef = inject(ElementRef);

  public get breakpointChange(): Observable<SkyBreakpointType> {
    return this.#breakpointChangeObs;
  }

  #observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === this.#elementRef.nativeElement) {
        for (const [breakpoint, check] of QUERIES.entries()) {
          if (check(entry.contentRect.width)) {
            // const el = this.#elementRef;
            // this.#adapter.removeResponsiveClasses(el);
            // this.#adapter.addResponsiveClass(el, breakpoint);
            this.#notifyBreakpointChange(breakpoint);
            break;
          }
        }
      }
    }
  });

  readonly #breakpointChange = new ReplaySubject<SkyBreakpointType>(1);
  readonly #breakpointChangeObs = this.#breakpointChange
    .asObservable()
    .pipe(takeUntilDestroyed());

  constructor() {
    this.#observer.observe(this.#elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  public destroy(): void {
    this.#observer.unobserve(this.#elementRef.nativeElement);
    this.#breakpointChange.complete();
  }

  #notifyBreakpointChange(breakpoint: SkyBreakpointType): void {
    this.#breakpointChange.next(breakpoint);
  }
}
