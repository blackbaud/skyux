import { ElementRef, Injectable, OnDestroy } from '@angular/core';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';
import { SkyMediaQueryListener } from '../media-query/media-query-listener';

import { SkyResizeObserverService } from './resize-observer.service';

const DEFAULT_BREAKPOINT = SkyMediaBreakpoints.md;

/**
 * Acts like `SkyMediaQueryService` for a container element, emitting the same responsive breakpoints.
 */
@Injectable({
  providedIn: 'any',
})
export class SkyResizeObserverMediaQueryService implements OnDestroy {
  /**
   * Returns the current breakpoint.
   */
  public get current(): SkyMediaBreakpoints {
    return this.#currentBreakpoint;
  }

  #breakpoints: {
    check: (width: number) => boolean;
    name: SkyMediaBreakpoints;
    classSuffix: string;
  }[] = [
    {
      check: (width: number): boolean => width > 0 && width <= 767,
      name: SkyMediaBreakpoints.xs,
      classSuffix: 'xs',
    },
    {
      check: (width: number): boolean => width > 767 && width <= 991,
      name: SkyMediaBreakpoints.sm,
      classSuffix: 'sm',
    },
    {
      check: (width: number): boolean => width > 991 && width <= 1199,
      name: SkyMediaBreakpoints.md,
      classSuffix: 'md',
    },
    {
      check: (width: number): boolean => width > 1199,
      name: SkyMediaBreakpoints.lg,
      classSuffix: 'lg',
    },
  ];

  #currentBreakpoint: SkyMediaBreakpoints = DEFAULT_BREAKPOINT;

  #currentBreakpointObs = new ReplaySubject<SkyMediaBreakpoints>(1);

  #ngUnsubscribe = new Subject<void>();

  #resizeObserverSvc: SkyResizeObserverService;

  #target: ElementRef | undefined;

  constructor(resizeObserverSvc: SkyResizeObserverService) {
    this.#resizeObserverSvc = resizeObserverSvc;
  }

  public ngOnDestroy(): void {
    this.unobserve();

    this.#target = undefined;
    this.#currentBreakpointObs.complete();
  }

  /**
   * @internal
   */
  public destroy(): void {
    this.ngOnDestroy();
  }

  /**
   * Sets the container element to watch. The `SkyResizeObserverMediaQueryService` will only observe one element at a
   * time. Any previous subscriptions will be unsubscribed when a new element is observed.
   */
  public observe(
    element: ElementRef,
    updateResponsiveClasses?: boolean
  ): SkyResizeObserverMediaQueryService {
    if (this.#target) {
      if (this.#target === element) {
        return this;
      }

      this.unobserve();
    }

    this.#target = element;

    this.#checkWidth(element);

    this.#resizeObserverSvc
      .observe(element)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((value) => {
        const breakpoint = this.#checkBreakpoint(value.contentRect.width);
        if (breakpoint && breakpoint !== this.current) {
          this.#updateBreakpoint(breakpoint, updateResponsiveClasses);
        }
      });
    return this;
  }

  /**
   * Stop watching the container element.
   */
  public unobserve(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * Subscribes to element size changes that cross breakpoints.
   */
  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentBreakpointObs
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((value) => {
        listener(value);
      });
  }

  #updateBreakpoint(
    breakpoint: SkyMediaBreakpoints,
    updateResponsiveClasses?: boolean
  ): void {
    if (updateResponsiveClasses) {
      this.#updateResponsiveClasses(this.#currentBreakpoint, breakpoint);
    }

    this.#currentBreakpoint = breakpoint;
    this.#currentBreakpointObs.next(breakpoint);
  }

  #updateResponsiveClasses(
    oldBreakpoint: SkyMediaBreakpoints,
    newBreakpoint: SkyMediaBreakpoints
  ): void {
    const oldClass = `sky-responsive-container-${
      this.#breakpoints.find((breakpoint) => breakpoint.name === oldBreakpoint)
        ?.classSuffix
    }`;
    const newClass = `sky-responsive-container-${
      this.#breakpoints.find((breakpoint) => breakpoint.name === newBreakpoint)
        ?.classSuffix
    }`;

    if (this.#target?.nativeElement.classList.contains(oldClass)) {
      this.#target.nativeElement.classList.remove(oldClass);
    }

    this.#target?.nativeElement.classList.add(newClass);
  }

  #checkBreakpoint(width: number): SkyMediaBreakpoints | undefined {
    const breakpoint = this.#breakpoints.find((breakpoint) =>
      breakpoint.check(width)
    );

    return breakpoint ? breakpoint.name : undefined;
  }

  #checkWidth(el: ElementRef): void {
    const width = (el.nativeElement as HTMLElement).offsetWidth || 0;
    const breakpoint = this.#checkBreakpoint(width);

    if (breakpoint && breakpoint !== this.#currentBreakpoint) {
      this.#updateBreakpoint(breakpoint);
    }
  }
}
