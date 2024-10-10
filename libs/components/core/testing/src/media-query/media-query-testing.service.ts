/* eslint-disable @nx/enforce-module-boundaries */
import {
  ElementRef,
  Injectable,
  OnDestroy,
  Renderer2,
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

import { ReplaySubject, Subscription } from 'rxjs';

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
  public get current(): SkyMediaBreakpoints {
    return this.#currentBreakpoint;
  }

  #currentBreakpoint = DEFAULT_BREAKPOINT;
  #currentBreakpointChange = new ReplaySubject<SkyMediaBreakpoints>(1);

  #elementRef: ElementRef | undefined;

  #currentBreakpointObs = this.#currentBreakpointChange
    .asObservable()
    .pipe(takeUntilDestroyed());

  readonly #renderer: Renderer2;

  #doUpdateResponsiveClasses = false;
  #observeSubscription: Subscription | undefined;

  constructor() {
    this.#renderer = inject(RendererFactory2).createRenderer(undefined, null);
  }

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentBreakpointObs.subscribe({
      next: (breakpoint) => {
        listener(breakpoint);
      },
    });
  }

  /* istanbul ignore next */
  public destroy(): void {
    this.ngOnDestroy();
  }

  public ngOnDestroy(): void {
    this.#observeSubscription?.unsubscribe();

    /* istanbul ignore else: safety check */
    if (this.#elementRef) {
      this.#removeResponsiveClasses(this.#elementRef.nativeElement);
    }
  }

  public setBreakpoint(breakpoint: SkyMediaBreakpoints): void {
    this.#currentBreakpoint = breakpoint;
    this.#currentBreakpointChange.next(breakpoint);
  }

  /* istanbul ignore next */
  public observe(
    elementRef: ElementRef,
    options?: { updateResponsiveClasses?: boolean },
  ): SkyResizeObserverMediaQueryService {
    this.#elementRef = elementRef;
    this.#doUpdateResponsiveClasses = options?.updateResponsiveClasses ?? false;

    this.#observeSubscription?.unsubscribe();
    this.#observeSubscription = this.subscribe((breakpoint) => {
      if (this.#elementRef && this.#doUpdateResponsiveClasses) {
        this.#removeResponsiveClasses(this.#elementRef.nativeElement);
        this.#addResponsiveClass(breakpoint);
      }
    });

    return this as unknown as SkyResizeObserverMediaQueryService;
  }

  /* istanbul ignore next */
  public unobserve(): void {
    /* noop */
  }

  #addResponsiveClass(breakpoint: SkyMediaBreakpoints): void {
    const className = this.#getClassForBreakpoint(breakpoint);
    this.#renderer.addClass(this.#elementRef?.nativeElement, className);
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
