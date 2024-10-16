import {
  ElementRef,
  Injectable,
  RendererFactory2,
  inject,
} from '@angular/core';

import {
  SKY_BREAKPOINT_TYPES,
  SkyBreakpointType,
} from './breakpoint-observers/breakpoint-type';
import { SkyMediaQueryService } from './media-query.service';

@Injectable()
export class SkyContainerQueryService extends SkyMediaQueryService {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  constructor() {
    super();
    this.breakpointChange.subscribe((breakpoint) => {
      this.#removeResponsiveClasses(this.#elementRef);
      this.#addResponsiveClass(this.#elementRef, breakpoint);
    });
  }

  #addResponsiveClass(
    elementRef: ElementRef,
    breakpoint: SkyBreakpointType,
  ): void {
    const className = this.#getClassForBreakpoint(breakpoint);
    this.#renderer.addClass(elementRef.nativeElement, className);
  }

  #removeResponsiveClasses(elementRef: ElementRef): void {
    for (const breakpoint of SKY_BREAKPOINT_TYPES) {
      const className = this.#getClassForBreakpoint(breakpoint);
      this.#renderer.removeClass(elementRef.nativeElement, className);
    }
  }

  #getClassForBreakpoint(breakpoint: SkyBreakpointType): string {
    return `sky-responsive-container-${breakpoint}`;
  }
}
