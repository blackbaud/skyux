/* eslint-disable @nx/enforce-module-boundaries */
import {
  ElementRef,
  Injectable,
  OnDestroy,
  RendererFactory2,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryListener,
  SkyMediaQueryServiceOverride,
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { SkyMediaQueryTestingController } from './media-query-testing.controller';

const DEFAULT_BREAKPOINT = SkyMediaBreakpoints.md;

/**
 * @internal
 */
@Injectable({ providedIn: 'root' })
export class SkyMediaQueryTestingService
  implements
    SkyMediaQueryServiceOverride,
    SkyMediaQueryTestingController,
    OnDestroy
{
  public get breakpointChange(): Observable<SkyMediaBreakpoints> {
    return this.#breakpointChangeObs;
  }

  public get current(): SkyMediaBreakpoints {
    return this.#currentBreakpoint;
  }

  #breakpointChange = new BehaviorSubject<SkyMediaBreakpoints>(
    DEFAULT_BREAKPOINT,
  );

  #breakpointChangeObs = this.#breakpointChange
    .asObservable()
    .pipe(takeUntilDestroyed());
  #currentBreakpoint = DEFAULT_BREAKPOINT;
  #observeSubscription: Subscription | undefined;

  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#breakpointChange.subscribe({
      next: (breakpoint) => {
        listener(breakpoint);
      },
    });
  }

  /* istanbul ignore next */
  public destroy(): void {
    this.#observeSubscription?.unsubscribe();
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  public setBreakpoint(breakpoint: SkyMediaBreakpoints): void {
    this.#currentBreakpoint = breakpoint;
    this.#breakpointChange.next(breakpoint);
  }

  /* istanbul ignore next */
  public observe(
    elementRef: ElementRef,
    options?: { updateResponsiveClasses?: boolean },
  ): SkyResizeObserverMediaQueryService {
    this.#observeSubscription?.unsubscribe();
    this.#observeSubscription = this.subscribe((breakpoint) => {
      if (options?.updateResponsiveClasses) {
        const el = elementRef.nativeElement;

        this.#removeResponsiveClasses(el);
        this.#addResponsiveClass(el, breakpoint);
      }
    });

    return this as unknown as SkyResizeObserverMediaQueryService;
  }

  /* istanbul ignore next */
  public unobserve(): void {
    this.#observeSubscription?.unsubscribe();
  }

  #addResponsiveClass(el: HTMLElement, breakpoint: SkyMediaBreakpoints): void {
    const className = this.#getClassForBreakpoint(breakpoint);
    this.#renderer.addClass(el, className);
  }

  #removeResponsiveClasses(el: HTMLElement): void {
    for (const breakpoint of Object.values(SkyMediaBreakpoints)) {
      if (typeof breakpoint === 'number') {
        const className = this.#getClassForBreakpoint(breakpoint);
        this.#renderer.removeClass(el, className);
      }
    }
  }

  #getClassForBreakpoint(breakpoint: SkyMediaBreakpoints): string {
    return `sky-responsive-container-${SkyMediaBreakpoints[breakpoint]}`;
  }
}
