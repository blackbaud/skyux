import {
  ElementRef,
  Injectable,
  RendererFactory2,
  inject,
} from '@angular/core';

import { SKY_BREAKPOINT_TYPES, SkyBreakpointType } from './breakpoint-type';

/**
 * @internal
 */
@Injectable({ providedIn: 'root' })
export class SkyContainerBreakpointObserverAdapterService {
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  public addResponsiveClass(
    elementRef: ElementRef,
    breakpoint: SkyBreakpointType,
  ): void {
    const className = this.#getClassForBreakpoint(breakpoint);
    this.#renderer.addClass(elementRef.nativeElement, className);
  }

  public removeResponsiveClasses(elementRef: ElementRef): void {
    for (const breakpoint of SKY_BREAKPOINT_TYPES) {
      const className = this.#getClassForBreakpoint(breakpoint);
      this.#renderer.removeClass(elementRef.nativeElement, className);
    }
  }

  #getClassForBreakpoint(breakpoint: SkyBreakpointType): string {
    return `sky-responsive-container-${breakpoint}`;
  }
}
