import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';
import { SkyMediaQueryListener } from '../media-query/media-query-listener';
import { SkyMediaQueryService } from '../media-query/media-query.service';

import { SkyResizeObserverService } from './resize-observer.service';

/**
 * Acts like `SkyMediaQueryService` for a container element, emitting the same responsive breakpoints.
 */
@Injectable()
export class SkyResizeObserverMediaQueryService
  extends SkyMediaQueryService
  implements OnDestroy
{
  /**
   * Returns the current breakpoint.
   */
  public get current(): SkyMediaBreakpoints | undefined {
    return this._currentBreakpoint;
  }

  private _breakpoints: {
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
  private _currentBreakpointObservable = new ReplaySubject<SkyMediaBreakpoints>(
    1
  );
  private _currentBreakpoint: SkyMediaBreakpoints;
  private _resizeSubscription: Subscription;
  private _stopListening = new Subject<void>();
  private _target?: ElementRef;

  constructor(
    zone: NgZone,
    private resizeObserverService: SkyResizeObserverService
  ) {
    super(zone);
    this._stopListening.subscribe(() => {
      this._target = undefined;
      this.notifyBreakpointChange(undefined);
    });
  }

  public ngOnDestroy(): void {
    this.removeListeners();
    this._stopListening.complete();
    this._currentBreakpointObservable.complete();
  }

  /**
   * Sets the container element to watch. The `SkyResizeObserverMediaQueryService` will only observe one element at a
   * time. Any previous subscriptions will be unsubscribed when a new element is observed.
   */
  public observe(element: ElementRef): SkyResizeObserverMediaQueryService {
    if (this._target) {
      if (this._target === element) {
        return this;
      }
      this._stopListening.next();
    }
    this._target = element;
    const width = (element.nativeElement as HTMLElement).offsetWidth;
    if (width) {
      const breakpoint = this.checkBreakpoint(width);
      this.notifyBreakpointChange(breakpoint);
    }
    this._resizeSubscription = this.resizeObserverService
      .observe(element)
      .pipe(takeUntil(this._stopListening))
      .subscribe((value) => {
        const breakpoint = this.checkBreakpoint(value.contentRect.width);
        /* istanbul ignore else */
        if (breakpoint !== this._currentBreakpoint) {
          this.notifyBreakpointChange(breakpoint);
        }
      });
    return this;
  }

  /**
   * Stop watching the container element.
   */
  public unobserve(): void {
    this._stopListening.next();
  }

  /**
   * Subscribes to element size changes that cross breakpoints.
   */
  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this._currentBreakpointObservable
      .pipe(takeUntil(this._stopListening))
      .subscribe(listener);
  }

  protected addListeners() {
    // do not add listeners in the constructor
  }

  protected notifyBreakpointChange(breakpoint: SkyMediaBreakpoints) {
    this._currentBreakpoint = breakpoint;
    this._currentBreakpointObservable.next(breakpoint);
  }

  protected removeListeners(): void {
    this._stopListening.next();
    this._currentBreakpoint = undefined;
  }

  private checkBreakpoint(width: number): SkyMediaBreakpoints | undefined {
    return this._breakpoints.find((breakpoint) => breakpoint.check(width))
      ?.name;
  }
}
