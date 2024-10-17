import { Directive, ElementRef, inject } from '@angular/core';

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
  standalone: true,
})
export class SkyResponsiveHostDirective {
  readonly #mediaSvc = inject(SkyMediaQueryService);

  /**
   * Emits when the breakpoint changes.
   */
  public get breakpointChange(): Observable<SkyBreakpoint> {
    return this.#mediaSvc.breakpointChange;
  }

  constructor() {
    const adapter = inject(SkyCoreAdapterService);
    const elementRef = inject(ElementRef);

    this.breakpointChange.subscribe((breakpoint) => {
      adapter.setResponsiveContainerClass(elementRef, breakpoint);
    });
  }
}
