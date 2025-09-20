import { ElementRef, Injectable, OnDestroy, inject } from '@angular/core';

import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyBreakpoint } from '../breakpoint-observer/breakpoint';
import { toSkyBreakpoint } from '../breakpoint-observer/breakpoint-utils';
import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';
import { SkyMediaQueryListener } from '../media-query/media-query-listener';
import { SkyMediaQueryService } from '../media-query/media-query.service';

import { SkyResizeObserverService } from './resize-observer.service';

const DEFAULT_BREAKPOINT = SkyMediaBreakpoints.md;

/**
 * Acts like `SkyMediaQueryService` for a container element, emitting the same responsive breakpoints.
 * @deprecated Use the `SkyResponsiveHostDirective` instead.
 */
@Injectable()
export class SkyResizeObserverMediaQueryService
  extends SkyMediaQueryService
  implements OnDestroy
{
  /**
   * Emits when the breakpoint changes.
   */
  public override get breakpointChange(): Observable<SkyBreakpoint> {
    return this.#breakpointChangeObs;
  }

  /**
   * Returns the current breakpoint.
   * @deprecated Subscribe to the `breakpointChange` observable instead.
   */
  public override get current(): SkyMediaBreakpoints {
    return this.#currentBreakpoint;
  }

  #breakpointChange = new ReplaySubject<SkyBreakpoint>(1);
  #breakpointChangeObs = this.#breakpointChange.asObservable();

  #breakpoints: {
    check: (width: number) => boolean;
    name: SkyMediaBreakpoints;
  }[] = [
    {
      check: (width: number): boolean => width > 0 && width <= 767,
      name: SkyMediaBreakpoints.xs,
    },
    {
      check: (width: number): boolean => width > 767 && width <= 991,
      name: SkyMediaBreakpoints.sm,
    },
    {
      check: (width: number): boolean => width > 991 && width <= 1199,
      name: SkyMediaBreakpoints.md,
    },
    {
      check: (width: number): boolean => width > 1199,
      name: SkyMediaBreakpoints.lg,
    },
  ];

  #currentBreakpoint: SkyMediaBreakpoints = DEFAULT_BREAKPOINT;

  #currentBreakpointObs = new ReplaySubject<SkyMediaBreakpoints>(1);

  #ngUnsubscribe = new Subject<void>();

  #resizeObserverSvc = inject(SkyResizeObserverService);

  #target: ElementRef | undefined;

  public override ngOnDestroy(): void {
    this.unobserve();

    this.#target = undefined;
    this.#currentBreakpointObs.complete();
    this.#breakpointChange.complete();
  }

  /**
   * @internal
   */
  public override destroy(): void {
    this.ngOnDestroy();
  }

  /**
   * Sets the container element to watch. The `SkyResizeObserverMediaQueryService` will only observe one element at a
   * time. Any previous subscriptions will be unsubscribed when a new element is observed.
   */
  public observe(
    element: ElementRef,
    options?: {
      updateResponsiveClasses?: boolean;
    },
  ): SkyResizeObserverMediaQueryService {
    if (this.#target) {
      if (this.#target === element) {
        return this;
      }

      this.unobserve();
    }

    this.#target = element;

    this.#checkWidth(element, options?.updateResponsiveClasses);

    this.#resizeObserverSvc
      .observe(element)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((value) => {
        const breakpoint = this.#checkBreakpoint(value.contentRect.width);
        if (breakpoint) {
          this.#updateBreakpoint(breakpoint, options?.updateResponsiveClasses);
        }
      });
    return this;
  }

  /**
   * Stop watching the container element and remove any added classes.
   */
  public unobserve(): void {
    this.#removeResponsiveClasses();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * Subscribes to element size changes that cross breakpoints.
   */
  public override subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentBreakpointObs
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((value) => {
        listener(value);
      });
  }

  #updateBreakpoint(
    breakpoint: SkyMediaBreakpoints,
    updateResponsiveClasses?: boolean,
  ): void {
    if (updateResponsiveClasses) {
      this.#updateResponsiveClasses(this.current, breakpoint);
    }

    if (this.current !== breakpoint) {
      this.#currentBreakpointObs.next(breakpoint);
      const breakpointType = toSkyBreakpoint(breakpoint);
      this.#breakpointChange.next(breakpointType);
    }
    this.#currentBreakpoint = breakpoint;
  }

  #updateResponsiveClasses(
    oldBreakpoint: SkyMediaBreakpoints,
    newBreakpoint: SkyMediaBreakpoints,
  ): void {
    const oldClass = this.#getClassForBreakpoint(oldBreakpoint);
    const newClass = this.#getClassForBreakpoint(newBreakpoint);

    const targetClassList = this.#target?.nativeElement?.classList;

    targetClassList?.remove(oldClass);
    targetClassList?.add(newClass);
  }

  #removeResponsiveClasses(): void {
    for (const breakpoint of Object.values(SkyMediaBreakpoints)) {
      if (typeof breakpoint === 'number') {
        const className = this.#getClassForBreakpoint(breakpoint);

        this.#target?.nativeElement?.classList?.remove(className);
      }
    }
  }

  #getClassForBreakpoint(breakpoint: SkyMediaBreakpoints): string {
    return `sky-responsive-container-${SkyMediaBreakpoints[breakpoint]}`;
  }

  #checkBreakpoint(width: number): SkyMediaBreakpoints | undefined {
    const breakpoint = this.#breakpoints.find((breakpoint) =>
      breakpoint.check(width),
    );

    return breakpoint ? breakpoint.name : undefined;
  }

  #checkWidth(el: ElementRef, updateResponsiveClasses?: boolean): void {
    const width = (el.nativeElement as HTMLElement).offsetWidth || 0;
    const breakpoint = this.#checkBreakpoint(width);

    if (breakpoint) {
      this.#updateBreakpoint(breakpoint, updateResponsiveClasses);
    }
  }
}
