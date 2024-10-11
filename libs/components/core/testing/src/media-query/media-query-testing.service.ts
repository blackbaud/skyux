/* eslint-disable @nx/enforce-module-boundaries */
import {
  ElementRef,
  Injectable,
  OnDestroy,
  RendererFactory2,
  inject,
} from '@angular/core';
import {
  SKY_MEDIA_BREAKPOINT_DEFAULT,
  SKY_MEDIA_BREAKPOINT_TYPE_DEFAULT,
  SkyMediaBreakpointType,
  SkyMediaBreakpoints,
  SkyMediaQueryListener,
  SkyMediaQueryServiceOverride,
  SkyResizeObserverMediaQueryService,
  isSkyMediaBreakpointType,
  toSkyMediaBreakpointType,
} from '@skyux/core';

import {
  BehaviorSubject,
  Observable,
  Subscription,
  firstValueFrom,
} from 'rxjs';

import { SkyMediaQueryTestingController } from './media-query-testing.controller';

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
  /**
   * Emits when the breakpoint changes.
   */
  public get breakpointChange(): Observable<SkyMediaBreakpointType> {
    return this.#breakpointChangeObs;
  }

  /**
   * Returns the current breakpoint.
   * @deprecated Subscribe to the `breakpointChange` observable instead.
   */
  public get current(): SkyMediaBreakpoints {
    return this.#currentBreakpoint;
  }

  #breakpointChange = new BehaviorSubject<SkyMediaBreakpointType>(
    SKY_MEDIA_BREAKPOINT_TYPE_DEFAULT,
  );

  #breakpointChangeObs = this.#breakpointChange.asObservable();
  #currentBreakpoint = SKY_MEDIA_BREAKPOINT_DEFAULT;
  #currentSubject = new BehaviorSubject<SkyMediaBreakpoints>(
    SKY_MEDIA_BREAKPOINT_DEFAULT,
  );

  #observeSubscription: Subscription | undefined;

  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  public ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * @internal
   */
  /* istanbul ignore next */
  public destroy(): void {
    this.#observeSubscription?.unsubscribe();
    this.#currentSubject.complete();
    this.#breakpointChange.complete();
  }

  public async expectBreakpoint(
    expectedBreakpoint: SkyMediaBreakpointType | SkyMediaBreakpoints,
  ): Promise<boolean> {
    const current = await firstValueFrom(this.#breakpointChange);

    if (isSkyMediaBreakpointType(expectedBreakpoint)) {
      return expectedBreakpoint === current;
    }

    return toSkyMediaBreakpointType(expectedBreakpoint) === current;
  }

  public setBreakpoint(breakpoint: SkyMediaBreakpoints): void {
    this.#currentBreakpoint = breakpoint;
    this.#currentSubject.next(breakpoint);

    const breakpointType = toSkyMediaBreakpointType(breakpoint);

    /* istanbul ignore else: safety check */
    if (breakpointType) {
      this.#breakpointChange.next(breakpointType);
    }
  }

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentSubject.subscribe({
      next: (breakpoint) => {
        listener(breakpoint);
      },
    });
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

  #getClassForBreakpoint(breakpoint: SkyMediaBreakpoints): string {
    return `sky-responsive-container-${SkyMediaBreakpoints[breakpoint]}`;
  }

  #removeResponsiveClasses(el: HTMLElement): void {
    for (const breakpoint of Object.values(SkyMediaBreakpoints)) {
      if (typeof breakpoint === 'number') {
        const className = this.#getClassForBreakpoint(breakpoint);
        this.#renderer.removeClass(el, className);
      }
    }
  }
}
