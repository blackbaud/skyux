import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';

import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
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

  private currentBreakpoint = new ReplaySubject<SkyMediaBreakpoints>(1);

  private _currentBreakpoint: SkyMediaBreakpoints;
  private _observable: Observable<ResizeObserverEntry>;
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
  private stopListening = new Subject<void>();

  constructor(
    zone: NgZone,
    private resizeObserverService: SkyResizeObserverService
  ) {
    super(zone);
    this.stopListening.subscribe(() => {
      this.notifyBreakpointChange(undefined);
    });
  }

  public ngOnDestroy(): void {
    this.removeListeners();
    this.stopListening.complete();
    this.currentBreakpoint.complete();
  }

  /**
   * Sets the container element to watch. The `SkyResizeObserverMediaQueryService` will only observe one element at a
   * time. Any previous subscriptions will be unsubscribed when a new element is observed.
   * @param element
   */
  public observe(element: ElementRef): void {
    this.stopListening.next();
    this._observable = this.resizeObserverService
      .observe(element)
      .pipe(takeUntil(this.stopListening));
    this.checkBreakpointChange(element.nativeElement.scrollWidth);
    this._observable.subscribe((entry) => {
      this.checkBreakpointChange(entry.contentRect.width);
    });
  }

  /**
   * Stop watching the container element.
   */
  public unobserve(): void {
    this.stopListening.next();
  }

  /**
   * Subscribes to element size changes.
   * @param listener Specifies a function that is called when breakpoints change.
   */
  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.currentBreakpoint
      .pipe(takeUntil(this.stopListening))
      .subscribe(listener);
  }

  private checkBreakpointChange(width: number) {
    this._breakpoints.forEach((breakpoint) => {
      if (
        this._currentBreakpoint !== breakpoint.name &&
        breakpoint.check(width)
      ) {
        this.notifyBreakpointChange(breakpoint.name);
      }
    });
  }

  protected addListeners() {
    // do not add listeners in the constructor
  }

  protected notifyBreakpointChange(breakpoint: SkyMediaBreakpoints) {
    this._currentBreakpoint = breakpoint;
    this.currentBreakpoint.next(breakpoint);
  }

  protected removeListeners(): void {
    this.stopListening.next();
    this._currentBreakpoint = undefined;
  }
}
