import {
  ElementRef,
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  fromEvent,
  Observable,
  Subject
} from 'rxjs';

import {
  map,
  takeUntil
} from 'rxjs/operators';

/**
 * @internal
 */
@Injectable()
export class SkyBackToTopDomAdapterService implements OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private windowRef: SkyAppWindowRef
  ) { }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * This event returns a boolean on scroll indicating whether the provided element is in view.
   * @param elementRef The target element reference.
   */
  public elementInViewOnScroll(elementRef: ElementRef): Observable<boolean> {
    const parent = this.findScrollableParent(elementRef.nativeElement);

    return fromEvent(parent, 'scroll')
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(() => {
          const isInView = this.isElementScrolledInView(
            elementRef.nativeElement,
            parent
          );
          return isInView;
        })
      );
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

    const windowObj = this.windowRef.nativeWindow;
    const parent = this.findScrollableParent(elementRef.nativeElement);

    if (parent === windowObj) {
      // Scroll to top of window, but account for omnibar if it exists.
      const omnibar = document.querySelector('.sky-omnibar-iframe');
      const newOffsetTop =
        elementRef.nativeElement.offsetTop - (omnibar ? omnibar.clientHeight : 0);
      this.windowRef.nativeWindow.scrollTo(
        elementRef.nativeElement.offsetLeft,
        newOffsetTop
      );
    } else {
      // Scroll to top of parent element.
      parent.scrollTop = parent.offsetTop - elementRef.nativeElement.offsetTop;
    }
  }

  private findScrollableParent(element: any): any {
    const regex = /(auto|scroll)/;
    const windowObj = this.windowRef.nativeWindow;
    const bodyObj = windowObj.document.body;

    let style = windowObj.getComputedStyle(element);
    let parent = element;

    do {
      parent = parent.parentNode;
      style = windowObj.getComputedStyle(parent);
    } while (
      !regex.test(style.overflow) &&
      !regex.test(style.overflowY) &&
      parent !== bodyObj
    );

    if (parent === bodyObj) {
      return windowObj;
    }

    return parent;
  }

  private isElementScrolledInView(
    element: any,
    parentElement: any
  ): boolean {
    const buffer = 25;
    const windowObj = this.windowRef.nativeWindow;
    const elementRect = element.getBoundingClientRect();

    /* istanbul ignore else */
    if (parentElement === windowObj) {
      return (elementRect.top > -buffer);
    } else {
      const parentRect = parentElement.getBoundingClientRect();
      return (elementRect.top > parentRect.top - buffer);
    }
  }
}
