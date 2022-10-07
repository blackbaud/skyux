import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { SkyAppWindowRef, SkyScrollableHostService } from '@skyux/core';

import { Observable, Subject, fromEvent as observableFromEvent } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

/**
 * @internal
 */
@Injectable()
export class SkyInfiniteScrollDomAdapterService implements OnDestroy {
  #ngUnsubscribe = new Subject<void>();
  #observer: MutationObserver | undefined;
  #parentChanges: Subject<void>;
  #parentChangesObs: Observable<void>;
  #scrollableHostSvc: SkyScrollableHostService;
  #windowRef: SkyAppWindowRef;

  constructor(
    scrollableHostSvc: SkyScrollableHostService,
    windowRef: SkyAppWindowRef
  ) {
    this.#scrollableHostSvc = scrollableHostSvc;
    this.#windowRef = windowRef;

    this.#parentChanges = new Subject<void>();
    this.#parentChangesObs = this.#parentChanges.asObservable();
  }

  public ngOnDestroy(): void {
    this.#parentChanges.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * This event is triggered when child nodes are added to the infinite
   * scroll parent container. e.g., A repeating list of elements was added.
   * @param elementRef The infinite scroll element reference.
   */
  public parentChanges(elementRef: ElementRef): Observable<void> {
    this.#createObserver(elementRef);
    return this.#parentChangesObs;
  }

  /**
   * This event is triggered when the provided element reference
   * is visible (or scrolled to) within its scrollable parent container.
   * @param elementRef The infinite scroll element reference.
   */
  public scrollTo(elementRef: ElementRef): Observable<void> {
    const parent = this.#scrollableHostSvc.getScrollableHost(elementRef);

    return observableFromEvent(parent, 'scroll').pipe(
      takeUntil(this.#ngUnsubscribe),
      filter(() => {
        return this.#isElementScrolledInView(elementRef.nativeElement, parent);
      }),
      map(() => undefined) // Change to void return type
    );
  }

  #createObserver(elementRef: ElementRef): void {
    this.#observer = new MutationObserver((mutations: MutationRecord[]) => {
      const hasUpdates = !!mutations.find((mutation) => {
        return (
          !elementRef.nativeElement.contains(mutation.target) &&
          mutation.addedNodes.length > 0
        );
      });

      if (hasUpdates) {
        this.#parentChanges.next();
      }
    });

    const windowObj = this.#windowRef.nativeWindow;
    const parent = this.#scrollableHostSvc.getScrollableHost(elementRef);
    const observedParent =
      parent === windowObj ? windowObj.document.body : parent;

    this.#observer.observe(observedParent, {
      childList: true,
      subtree: true,
    });
  }

  #isElementScrolledInView(
    element: HTMLElement,
    parentElement: HTMLElement | Window
  ): boolean {
    const windowObj = this.#windowRef.nativeWindow as Window;

    if (parentElement === windowObj) {
      return (
        parentElement.pageYOffset + parentElement.innerHeight >
        element.offsetTop
      );
    }

    const elementRect = element.getBoundingClientRect();
    const parentRect = (parentElement as HTMLElement).getBoundingClientRect();

    return elementRect.top < parentRect.top + parentRect.height;
  }
}
