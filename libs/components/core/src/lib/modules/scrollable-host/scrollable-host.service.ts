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
   * @param completionObservable An observable which alerts the internal observers that they should complete
   * @returns An observable which emits the current scrollable host
   * @internal
   */
  public watchScrollableHost(
    elementRef: ElementRef
  ): Observable<HTMLElement | Window> {
    const subscribers: Subscriber<HTMLElement | Window>[] = [];
    let parentMutationObserver: MutationObserver;
    let documentHiddenElementMutationObserver: MutationObserver;

    return new Observable((subscriber) => {
      subscribers.push(subscriber);

      let scrollableHost = this.findScrollableHost(elementRef.nativeElement);
      if (subscribers.length === 1) {
        parentMutationObserver = this.mutationObserverSvc.create(() => {
          const newScrollableHost = this.findScrollableHost(
            elementRef.nativeElement
          );

          if (
            newScrollableHost !== scrollableHost &&
            elementRef.nativeElement.offsetParent
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
            if (!elementRef.nativeElement.offsetParent) {
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
      subscriber.next(scrollableHost);

      subscriber.add(() => {
        const subIndex = subscribers.indexOf(subscriber);

        /* sanity check */
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
   * @param completionObservable An observable which alerts the internal observers that they should complete
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
          if (newScrollableHost) {
            scrollEventSubscription = fromEvent(newScrollableHost, 'scroll')
              .pipe(takeUntil(newScrollableHostObservable))
              .subscribe(() => {
                notifySubscribers(subscribers);
              });
          }
        });
      }

      subscriber.add(() => {
        const subIndex = subscribers.indexOf(subscriber);

        /* sanity check */
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

  private findScrollableHost(element: HTMLElement): HTMLElement | Window {
    const regex = /(auto|scroll)/;
    const windowObj = this.windowRef.nativeWindow;
    const bodyObj = windowObj.document.body;

    /* Sanity check */
    if (!element) {
      return windowObj;
    }

    let style = windowObj.getComputedStyle(element);
    let parent: HTMLElement = element;

    do {
      parent = parent.parentNode as HTMLElement;

      /* Sanity check for if this function is called for an element which has been removed from the DOM */
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
    element: HTMLElement | Window,
    mutationObserver: MutationObserver
  ) {
    mutationObserver.disconnect();
    if (element instanceof HTMLElement) {
      mutationObserver.observe(element, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        childList: true,
        subtree: true,
      });
    } else {
      mutationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        childList: true,
        subtree: true,
      });
    }
  }
}
