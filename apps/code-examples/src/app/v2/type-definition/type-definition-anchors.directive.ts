import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

import { SkyTypeAnchorIdsService } from './pipes/type-anchor-ids.service';

@Directive({
  selector: '[skyTypeDefinitionAnchors]',
})
export class SkyTypeDefinitionAnchorsDirective implements AfterViewInit {
  readonly #anchorSvc = inject(SkyTypeAnchorIdsService);
  readonly #elementRef = inject(ElementRef);
  // readonly #ngZone = inject(NgZone);
  // readonly #renderer = inject(Renderer2);

  public ngAfterViewInit(): void {
    const el = this.#elementRef.nativeElement as HTMLElement;

    const originalText = el.textContent;

    const replacement = originalText?.replace(/\w+/g, (type) => {
      const anchorId = this.#anchorSvc.getAnchorId(type);

      if (anchorId) {
        return `<a href="#${anchorId}">${type}</a>`;
      }

      return type;
    });

    if (originalText !== replacement) {
      console.log(replacement);

      // this.#ngZone.runOutsideAngular(() => {
      //   this.#renderer.setProperty(
      //     this.#elementRef.nativeElement,
      //     'innerHTML',
      //     replacement,
      //   );
      // });
    }

    // console.log('parts', parts);

    // if (parts) {
    //   for (const part of parts) {
    //     const anchorId = this.#anchorSvc.getAnchorId(part);

    //     if (anchorId) {
    //       console.log('found!', anchorId);
    //     } else {
    //       console.error('not found', part);
    //     }
    //   }
    // }
  }
}
