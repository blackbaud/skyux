import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { SkyAppWindowRef, SkyScrollableHostService } from '@skyux/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * @internal
 */
@Injectable()
export class SkyBackToTopDomAdapterService implements OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private scrollableHostScrollEventUnsubscribe = new Subject<void>();

  constructor(
    private windowRef: SkyAppWindowRef,
    private scrollableHostService: SkyScrollableHostService
  ) {}

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.scrollableHostScrollEventUnsubscribe.next();
    this.scrollableHostScrollEventUnsubscribe.complete();
  }

  /**
   * This event returns a boolean on scroll indicating whether the provided element is in view.
   * @param elementRef The target element reference.
   */
  public elementInViewOnScroll(elementRef: ElementRef): Observable<boolean> {
    const scrollableHostObservable =
      this.scrollableHostService.watchScrollableHostScrollEvents(elementRef);

    const isInitiallyInView = this.isElementScrolledInView(
      elementRef.nativeElement,
      this.scrollableHostService.getScrollableHost(elementRef)
    );
    const returnedObservable = new BehaviorSubject<boolean>(isInitiallyInView);

    scrollableHostObservable
      .pipe(takeUntil(this.scrollableHostScrollEventUnsubscribe))
      .subscribe(() => {
        const isInView = this.isElementScrolledInView(
          elementRef.nativeElement,
          this.scrollableHostService.getScrollableHost(elementRef)
        );
        returnedObservable.next(isInView);
      });

    return returnedObservable;
  }

  /**
   * Scrolls the window or scrollable parent to the provided element.
   * @param elementRef The target element reference.
   */
  public scrollToElement(elementRef: ElementRef): void {
    /* sanity check */
    /* istanbul ignore if */
    if (!elementRef || !elementRef.nativeElement) {
      return;
    }

    const scrollableHost =
      this.scrollableHostService.getScrollableHost(elementRef);

    if (scrollableHost instanceof Window) {
      // Scroll to top of window, but account for the body margin that allows for the omnibar if it exists.
      const bodyMarginOffset = parseInt(
        getComputedStyle(document.body).marginTop,
        10
      );
      const newOffsetTop =
        elementRef.nativeElement.offsetTop - bodyMarginOffset;
      this.windowRef.nativeWindow.scrollTo(
        elementRef.nativeElement.offsetLeft,
        newOffsetTop
      );
    } else {
      // Scroll to top of parent element.
      scrollableHost.scrollTop =
        scrollableHost.offsetTop - elementRef.nativeElement.offsetTop;
    }
  }

  public isElementScrolledInView(element: any, parentElement: any): boolean {
    if (!element.offsetParent) {
      return true;
    }
    const buffer = 25;
    const elementRect = element.getBoundingClientRect();

    /* istanbul ignore else */
    if (parentElement instanceof HTMLElement) {
      const parentRect = parentElement.getBoundingClientRect();
      return elementRect.top > parentRect.top - buffer;
    } else {
      return elementRect.top > -buffer;
    }
  }
}
