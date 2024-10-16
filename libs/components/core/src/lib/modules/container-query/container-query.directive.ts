import { Directive, ElementRef, RendererFactory2, inject } from '@angular/core';

import {
  SKY_BREAKPOINT_TYPES,
  SkyBreakpointType,
} from '../media-query/breakpoint-observers/breakpoint-type';
import { provideSkyBreakpointObserver } from '../media-query/breakpoint-observers/provide-breakpoint-observer';
import { SkyMediaQueryService } from '../media-query/media-query.service';

import { SkyContainerBreakpointObserver } from './container-breakpoint-observer';

@Directive({
  providers: [provideSkyBreakpointObserver(SkyContainerBreakpointObserver)],
  selector: '[skyContainerQuery]',
  standalone: true,
})
export class SkyContainerQueryDirective {
  readonly #querySvc = inject(SkyMediaQueryService);
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  constructor() {
    this.#querySvc.breakpointChange.subscribe((breakpoint) => {
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
