import { Directive, ElementRef, Injector, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { SkyCoreAdapterService } from '../adapter-service/adapter.service';
import { SkyMediaQueryService } from '../media-query/media-query.service';

import { SkyBreakpoint } from './breakpoint';
import { SkyContainerBreakpointObserver } from './container-breakpoint-observer';
import { provideSkyBreakpointObserver } from './provide-breakpoint-observer';

/**
 * Overrides the `SkyMediaQueryService` to emit breakpoint changes when the host
 * container is resized. This directive also adds SKY UX CSS classes to the
 * host element to allow for responsive styles.
 */
@Directive({
  exportAs: 'skyResponsiveHost',
  providers: [provideSkyBreakpointObserver(SkyContainerBreakpointObserver)],
  selector: '[skyResponsiveHost]',
})
export class SkyResponsiveHostDirective {
  readonly #injector = inject(Injector);
  readonly #mediaSvc = inject(SkyMediaQueryService);

  /**
   * Emits when the breakpoint changes.
   */
  public get breakpointChange(): Observable<SkyBreakpoint> {
    return this.#mediaSvc.breakpointChange;
  }

  /**
   * The injector of the responsive host. Useful when displaying child components
   * via `ngTemplateOutlet`.
   * @example```
   * <my-container #responsiveHost="skyResponsiveHost">
   *   <ng-container
   *     [ngTemplateOutlet]="myTemplate"
   *     [ngTemplateOutletInjector]="responsiveHost.injector"
   *   />
   * </my-container>
   * ```
   */
  public get injector(): Injector {
    return this.#injector;
  }

  constructor() {
    const adapter = inject(SkyCoreAdapterService);
    const elementRef = inject(ElementRef);

    this.breakpointChange.subscribe((breakpoint) => {
      adapter.setResponsiveContainerClass(elementRef, breakpoint);
    });
  }
}
