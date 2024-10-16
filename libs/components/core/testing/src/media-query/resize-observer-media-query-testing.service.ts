// import {
//   ElementRef,
//   Injectable,
//   RendererFactory2,
//   inject,
// } from '@angular/core';
// import {
//   SKY_MEDIA_BREAKPOINT_TYPES,
//   SkyBreakpointType,
//   SkyResizeObserverMediaQueryService,
//   SkyResizeObserverMediaQueryServiceInterface,
// } from '@skyux/core';

// import { Subscription } from 'rxjs';

// import { SkyMediaQueryTestingControllerInterface } from './media-query-testing-controller-interface';
// import { SkyMediaQueryTestingService } from './media-query-testing.service';

// @Injectable()
// export class SkyResizeObserverMediaQueryTestingService
//   extends SkyMediaQueryTestingService
//   implements
//     SkyMediaQueryTestingControllerInterface,
//     SkyResizeObserverMediaQueryServiceInterface
// {
//   readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

//   #observeSubscription: Subscription | undefined;

//   public override destroy(): void {
//     super.destroy();
//     this.#observeSubscription?.unsubscribe();
//   }

//   public observe(
//     elementRef: ElementRef,
//     options?: { updateResponsiveClasses?: boolean },
//   ): SkyResizeObserverMediaQueryService {
//     this.#observeSubscription?.unsubscribe();
//     this.#observeSubscription = this.breakpointChange.subscribe(
//       (breakpoint) => {
//         if (options?.updateResponsiveClasses) {
//           const el = elementRef.nativeElement;

//           this.#removeResponsiveClasses(el);
//           this.#addResponsiveClass(el, breakpoint);
//         }
//       },
//     );

//     return this as unknown as SkyResizeObserverMediaQueryService;
//   }

//   public unobserve(): void {
//     this.#observeSubscription?.unsubscribe();
//   }

//   #addResponsiveClass(el: HTMLElement, breakpoint: SkyBreakpointType): void {
//     const className = this.#getClassForBreakpoint(breakpoint);
//     this.#renderer.addClass(el, className);
//   }

//   #getClassForBreakpoint(breakpoint: SkyBreakpointType): string {
//     return `sky-responsive-container-${breakpoint}`;
//   }

//   #removeResponsiveClasses(el: HTMLElement): void {
//     for (const breakpoint of SKY_MEDIA_BREAKPOINT_TYPES) {
//       const className = this.#getClassForBreakpoint(breakpoint);
//       this.#renderer.removeClass(el, className);
//     }
//   }
// }
