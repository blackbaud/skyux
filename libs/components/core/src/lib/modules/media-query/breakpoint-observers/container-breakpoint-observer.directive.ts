import { Directive, ElementRef, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { SkyCoreAdapterService } from '../../adapter-service/adapter.service';
import { SkyMediaQueryService } from '../media-query.service';

import { SkyBreakpointType } from './breakpoint-type';
import { SkyContainerBreakpointObserver } from './container-breakpoint-observer';
import { provideSkyBreakpointObserver } from './provide-breakpoint-observer';

/**
 * Overrides the `SkyMediaQueryService` to emit breakpoint changes when the host
 * container is resized. This directive also adds specific CSS classes to the
 * host element to allow for responsive styles.
 */
@Directive({
  exportAs: 'skyContainerBreakpointObserver',
  providers: [provideSkyBreakpointObserver(SkyContainerBreakpointObserver)],
  selector: '[skyContainerBreakpointObserver]',
  standalone: true,
})
export class SkyContainerBreakpointObserverDirective {
  readonly #mediaSvc = inject(SkyMediaQueryService);

  /**
   * Emits when the breakpoint changes.
   */
  public get breakpointChange(): Observable<SkyBreakpointType> {
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
