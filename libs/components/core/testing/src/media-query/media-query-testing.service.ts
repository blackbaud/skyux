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
  toSkyMediaBreakpoints,
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
  public get breakpointChange(): Observable<SkyMediaBreakpointType> {
    return this.#breakpointChangeObs;
  }

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

  public destroy(): void {
    this.#observeSubscription?.unsubscribe();
    this.#currentSubject.complete();
    this.#breakpointChange.complete();
  }

  public async expectBreakpoint(
    expectedBreakpoint: SkyMediaBreakpointType,
  ): Promise<void> {
    const current = await firstValueFrom(this.#breakpointChange);

    if (expectedBreakpoint !== current) {
      throw new Error(
        `Expected the current media breakpoint to be "${expectedBreakpoint}", but it is "${current}".`,
      );
    }
  }

  public setBreakpoint(breakpoint: SkyMediaBreakpointType): void {
    const breakpointLegacy = toSkyMediaBreakpoints(breakpoint);
    this.#currentBreakpoint = breakpointLegacy;
    this.#currentSubject.next(breakpointLegacy);
    this.#breakpointChange.next(breakpoint);
  }

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.#currentSubject.subscribe({
      next: (breakpoint) => {
        listener(breakpoint);
      },
    });
  }

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
