import { ElementRef, Injectable, OnDestroy } from '@angular/core';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';
import { SkyMediaQueryListener } from '../media-query/media-query-listener';

import { SkyResizeObserverService } from './resize-observer.service';

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
  public get current(): SkyMediaBreakpoints | undefined {
    return this._currentBreakpoint;
  }

  #breakpoints: {
    check: (width: number) => boolean;
    name: SkyMediaBreakpoints;
  }[] = [
    {
      check: (width: number) => width <= 767,
      name: SkyMediaBreakpoints.xs,
    },
    {
      check: (width: number) => width > 767 && width <= 991,
      name: SkyMediaBreakpoints.sm,
    },
    {
      check: (width: number) => width > 991 && width <= 1199,
      name: SkyMediaBreakpoints.md,
    },
    {
      check: (width: number) => width > 1199,
      name: SkyMediaBreakpoints.lg,
    },
  ];

  #currentBreakpointObservable = new ReplaySubject<
    SkyMediaBreakpoints | undefined
  >(1);

  private _currentBreakpoint: SkyMediaBreakpoints;

  #resizeSubscription: Subscription;

  #stopListening = new Subject<void>();

  #target: ElementRef;

  constructor(private resizeObserverService: SkyResizeObserverService) {
    this.#stopListening.subscribe(() => {
      this.#target = undefined;
      this.updateBreakpoint(undefined);
    });
  }

  public ngOnDestroy(): void {
    this.#stopListening.next();
    this._currentBreakpoint = undefined;
    this.#stopListening.complete();
    this.#currentBreakpointObservable.complete();
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
  public observe(element: ElementRef): SkyResizeObserverMediaQueryService {
    if (this.#target) {
      if (this.#target === element) {
        return this;
      }

      this.#stopListening.next();
    }

    this.#target = element;

    const width = (element.nativeElement as HTMLElement).offsetWidth;
    if (width) {
      const breakpoint = this.checkBreakpoint(width);
      this.updateBreakpoint(breakpoint);
    }

    this.#resizeSubscription = this.resizeObserverService
      .observe(element)
      .pipe(takeUntil(this.#stopListening))
      .subscribe((value) => {
        const breakpoint = this.checkBreakpoint(value.contentRect.width);
        /* istanbul ignore else */
        if (breakpoint !== this._currentBreakpoint) {
          this.updateBreakpoint(breakpoint);
        }
      });
    return this;
  }

  /**
   * Stop watching the container element.
   */
  public unobserve(): void {
    this.#stopListening.next();
  }

  /**
   * Subscribes to element size changes that cross breakpoints.
   */
  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentBreakpointObservable
      .pipe(takeUntil(this.#stopListening))
      .subscribe(listener);
  }

  private updateBreakpoint(breakpoint: SkyMediaBreakpoints) {
    this._currentBreakpoint = breakpoint;
    this.#currentBreakpointObservable.next(breakpoint);
  }

  private checkBreakpoint(width: number): SkyMediaBreakpoints | undefined {
    return this.#breakpoints.find((breakpoint) => breakpoint.check(width))
      ?.name;
  }
}
