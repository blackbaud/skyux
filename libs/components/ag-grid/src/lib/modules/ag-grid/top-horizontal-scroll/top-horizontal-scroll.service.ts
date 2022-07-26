import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { MutationObserverService } from '@skyux/core';

@Injectable({
  providedIn: 'root',
})
export class TopHorizontalScrollService implements OnDestroy {
  private mutationObserver: MutationObserver;

  constructor(private mutationObserverSvc: MutationObserverService) {}

  public ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  public appendTopScrollbarToGrid(elementRef: ElementRef): void {
    // css class selectors
    const headerSelector = '.ag-header';
    const scrollSelector = '.ag-body-horizontal-scroll';
    const scrollViewportSelector = '.ag-body-horizontal-scroll-viewport';
    const scrollContainerSelector = '.ag-body-horizontal-scroll-container';

    // get scrollbar elements
    const scrollElement =
      elementRef.nativeElement.querySelector(scrollSelector);
    const scrollViewportElement = elementRef.nativeElement.querySelector(
      scrollViewportSelector
    );
    const scrollContainerElement = elementRef.nativeElement.querySelector(
      scrollContainerSelector
    );

    // create scrollbar clones
    const cloneElement = scrollElement.cloneNode(true) as Element;
    const cloneViewportElement = cloneElement.querySelector(
      scrollViewportSelector
    );
    const cloneContainerElement = cloneElement.querySelector(
      scrollContainerSelector
    );

    // insert scrollbar clone
    const headerElement =
      elementRef.nativeElement.querySelector(headerSelector);
    headerElement.insertAdjacentElement('afterend', cloneElement);

    // add event listeners to keep scroll position synchronized
    scrollViewportElement.addEventListener('scroll', () =>
      cloneViewportElement.scrollTo({ left: scrollViewportElement.scrollLeft })
    );
    cloneViewportElement.addEventListener('scroll', () =>
      scrollViewportElement.scrollTo({ left: cloneViewportElement.scrollLeft })
    );

    this.mutationObserver = this.mutationObserverSvc.create(() => {
      cloneElement.setAttribute('style', scrollElement.getAttribute('style'));
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
    this.mutationObserver.observe(scrollElement, {
      attributeFilter: ['style'],
      subtree: true,
    });
  }
}
