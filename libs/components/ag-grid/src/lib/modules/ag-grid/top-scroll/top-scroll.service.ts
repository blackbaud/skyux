import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { MutationObserverService } from '@skyux/core';

// css class selectors
const HEADER_SELECTOR = '.ag-header';
const SCROLL_SELECTOR = '.ag-body-horizontal-scroll';
const SCROLL_VIEWPORT_SELECTOR = '.ag-body-horizontal-scroll-viewport';
const SCROLL_CONTAINER_SELECTOR = '.ag-body-horizontal-scroll-container';

@Injectable({
  providedIn: 'root',
})
export class SkyAgGridTopScrollService implements OnDestroy {
  #mutationObserver: MutationObserver;
  #mutationObserverSvc: MutationObserverService;

  constructor(mutationObserverSvc: MutationObserverService) {
    this.#mutationObserverSvc = mutationObserverSvc;
  }

  public ngOnDestroy(): void {
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
    }
  }

  public appendTopScrollbarToGrid(elementRef: ElementRef): void {
    // get scrollbar elements
    const scrollElement =
      elementRef.nativeElement.querySelector(SCROLL_SELECTOR);
    const scrollViewportElement = elementRef.nativeElement.querySelector(
      SCROLL_VIEWPORT_SELECTOR
    );
    const scrollContainerElement = elementRef.nativeElement.querySelector(
      SCROLL_CONTAINER_SELECTOR
    );

    // create scrollbar clones
    const cloneElement = scrollElement.cloneNode(true) as HTMLElement;
    const cloneViewportElement = cloneElement.querySelector(
      SCROLL_VIEWPORT_SELECTOR
    );
    const cloneContainerElement = cloneElement.querySelector(
      SCROLL_CONTAINER_SELECTOR
    );

    // insert scrollbar clone
    const headerElement =
      elementRef.nativeElement.querySelector(HEADER_SELECTOR);
    headerElement.insertAdjacentElement('afterend', cloneElement);

    // add event listeners to keep scroll position synchronized
    scrollViewportElement.addEventListener('scroll', () =>
      cloneViewportElement.scrollTo({ left: scrollViewportElement.scrollLeft })
    );
    cloneViewportElement.addEventListener('scroll', () =>
      scrollViewportElement.scrollTo({ left: cloneViewportElement.scrollLeft })
    );

    this.#mutationObserver = this.#mutationObserverSvc.create(() => {
      // Maintain viewkeeper scroll position when the grid is resized, but update the scrollbar size
      cloneElement.style.width = `${scrollElement.style.width}`;
      cloneViewportElement.setAttribute(
        'style',
        scrollViewportElement.getAttribute('style')
      );
      cloneContainerElement.setAttribute(
        'style',
        scrollContainerElement.getAttribute('style')
      );
    });

    // start observing the scroll elements for `style` attribute changes
    this.#mutationObserver.observe(scrollElement, {
      attributeFilter: ['style'],
      subtree: true,
    });
  }
}
