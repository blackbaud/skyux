import { ElementRef, Injectable } from '@angular/core';

import { Observable, Subject, Subscriber, Subscription, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MutationObserverService } from '../mutation/mutation-observer-service';
import { SkyAppWindowRef } from '../window/window-ref';

function notifySubscribers(subscribers: Subscriber<unknown>[], item?: unknown) {
  for (const subscriber of subscribers) {
    subscriber.next(item);
  }
}

@Injectable({
  providedIn: 'root',
})
export class SkyScrollableHostService {
  constructor(
    private mutationObserverSvc: MutationObserverService,
    private windowRef: SkyAppWindowRef
  ) {}

  /**
   * Returns the given element's current scrollable host
   * @param elementRef The element whose scrollable host is being requested
   * @returns The current scrollable host
   */
  public getScrollableHost(elementRef: ElementRef): HTMLElement | Window {
    return this.findScrollableHost(elementRef.nativeElement);
  }

  /**
   * Returns an observable which emits the given element's current scrollable host
   * @param elementRef The element whose scrollable host is being requested
   * @returns An observable which emits the current scrollable host element.
   * @internal
   */
  public watchScrollableHost(
    elementRef: ElementRef
  ): Observable<HTMLElement | Window | undefined> {
    const subscribers: Subscriber<HTMLElement | Window>[] = [];

    let parentMutationObserver: MutationObserver;
    let documentHiddenElementMutationObserver: MutationObserver;

    return new Observable((subscriber) => {
      subscribers.push(subscriber);

      let scrollableHost = this.findScrollableHost(elementRef.nativeElement);

      // Setup mutation observers only once, for all subscribers.
      if (subscribers.length === 1) {
        parentMutationObserver = this.mutationObserverSvc.create(() => {
          const newScrollableHost = this.findScrollableHost(
            elementRef.nativeElement
          );

          // Reset observer if scrollable host changes.
          if (
            newScrollableHost !== scrollableHost &&
            this.isElementVisible(elementRef)
          ) {
            scrollableHost = newScrollableHost;

            this.observeForScrollableHostChanges(
              scrollableHost,
              parentMutationObserver
            );

            notifySubscribers(subscribers, scrollableHost);
          }
        });

        this.observeForScrollableHostChanges(
          scrollableHost,
          parentMutationObserver
        );

        documentHiddenElementMutationObserver = this.mutationObserverSvc.create(
          () => {
            if (scrollableHost && !this.isElementVisible(elementRef)) {
              // If the scrollable host is not visible, set it to undefined and unsubscribe from its mutation changes.
              // Then, observe the document element so that a new scrollable host can be found.
              scrollableHost = undefined;

              this.observeForScrollableHostChanges(
                scrollableHost,
                parentMutationObserver
              );

              notifySubscribers(subscribers, scrollableHost);
            }
          }
        );

        this.observeDocumentHiddenElementChanges(
          documentHiddenElementMutationObserver
        );
      }

      // Emit the scrollable host to the subscriber.
      subscriber.next(scrollableHost);

      // Teardown callback for the subscription.
      subscriber.add(() => {
        const subIndex = subscribers.indexOf(subscriber);

        /* istanbul ignore else */
        if (subIndex >= 0) {
          subscribers.splice(subIndex, 1);
        }

        if (subscribers.length === 0) {
          documentHiddenElementMutationObserver.disconnect();
          parentMutationObserver.disconnect();
        }
      });
    });
  }

  /**
   * Returns an observable which emits whenever the element's scrollable host emits a scroll event. The observable will always emit the scroll events from the elements current scrollable host and will update based on any scrollable host changes. The observable will also emit once whenever the scrollable host changes.
   * @param elementRef The element whose scrollable host scroll events are being requested
   * @returns An observable which emits when the elements scrollable host is scrolled or is changed
   */
  public watchScrollableHostScrollEvents(
    elementRef: ElementRef
  ): Observable<void> {
    const subscribers: Subscriber<void>[] = [];

    let scrollableHost: HTMLElement | Window;

    let newScrollableHostObservable = new Subject<void>();
    let scrollableHostSubscription: Subscription;
    let scrollEventSubscription: Subscription;

    return new Observable((subscriber) => {
      subscribers.push(subscriber);

      // Setup mutation observers only once, for all subscribers.
      if (subscribers.length === 1) {
        scrollableHostSubscription = this.watchScrollableHost(
          elementRef
        ).subscribe((newScrollableHost) => {
          newScrollableHostObservable.next();
          newScrollableHostObservable.complete();

          if (scrollableHost && scrollableHost !== newScrollableHost) {
            notifySubscribers(subscribers);
          }

          scrollableHost = newScrollableHost;
          newScrollableHostObservable = new Subject();

          // Only subscribe to scroll events if the host element is defined.
          /* istanbul ignore else */
          if (newScrollableHost) {
            scrollEventSubscription = fromEvent(newScrollableHost, 'scroll')
              .pipe(takeUntil(newScrollableHostObservable))
              .subscribe(() => {
                notifySubscribers(subscribers);
              });
          }
        });
      }

      // Teardown callback for the subscription.
      subscriber.add(() => {
        const subIndex = subscribers.indexOf(subscriber);

        /* istanbul ignore else */
        if (subIndex >= 0) {
          subscribers.splice(subIndex, 1);
        }

        if (subscribers.length === 0) {
          scrollableHostSubscription.unsubscribe();
          scrollEventSubscription.unsubscribe();
          newScrollableHostObservable.complete();
        }
      });
    });
  }

  private findScrollableHost(
    element: HTMLElement | undefined
  ): HTMLElement | Window {
    const regex = /(auto|scroll)/;
    const windowObj = this.windowRef.nativeWindow;
    const bodyObj = windowObj.document.body;

    if (!element) {
      return windowObj;
    }

    let style = windowObj.getComputedStyle(element);
    let parent = element;

    do {
      parent = parent.parentNode as HTMLElement;

      // Return `window` if the parent element has been removed from the DOM.
      if (!(parent instanceof HTMLElement)) {
        return windowObj;
      }

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

  private observeDocumentHiddenElementChanges(
    mutationObserver: MutationObserver
  ) {
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden'],
      childList: true,
      subtree: true,
    });
  }

  private observeForScrollableHostChanges(
    element: HTMLElement | Window | undefined,
    mutationObserver: MutationObserver
  ) {
    mutationObserver.disconnect();

    const target =
      element instanceof HTMLElement ? element : document.documentElement;

    mutationObserver.observe(target, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      childList: true,
      subtree: true,
    });
  }

  /**
   * Determines if an element is "visible" in the DOM.
   * @see https://stackoverflow.com/a/11639664/6178885
   */
  private isElementVisible(elementRef: ElementRef): boolean {
    return elementRef.nativeElement.offsetParent;
  }
}
