import { ElementRef, EventEmitter, Injectable, OnDestroy } from '@angular/core';

import { SkyAppWindowRef } from '@skyux/core';

import { fromEvent as observableFromEvent, Observable, Subject } from 'rxjs';

import { filter, map, takeUntil } from 'rxjs/operators';

/**
 * @internal
 */
@Injectable()
export class SkyInfiniteScrollDomAdapterService implements OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  private observer: MutationObserver;

  private _parentChanges = new EventEmitter<void>();

  constructor(private windowRef: SkyAppWindowRef) {}

  public ngOnDestroy(): void {
    this._parentChanges.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * This event is triggered when child nodes are added to the infinite
   * scroll parent container. e.g., A repeating list of elements was added.
   * @param elementRef The infinite scroll element reference.
   */
  public parentChanges(elementRef: ElementRef): Observable<void> {
    this.createObserver(elementRef.nativeElement);
    return this._parentChanges;
  }

  /**
   * This event is triggered when the provided element reference
   * is visible (or scrolled to) within its scrollable parent container.
   * @param elementRef The infinite scroll element reference.
   */
  public scrollTo(elementRef: ElementRef): Observable<void> {
    const parent = this.findScrollableParent(elementRef.nativeElement);

    return observableFromEvent(parent, 'scroll').pipe(
      takeUntil(this.ngUnsubscribe),
      filter(() => {
        return this.isElementScrolledInView(elementRef.nativeElement, parent);
      }),
      map(() => undefined) // Change to void return type
    );
  }

  private createObserver(element: any): void {
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      const hasUpdates = !!mutations.find((mutation) => {
        return (
          !element.contains(mutation.target) && mutation.addedNodes.length > 0
        );
      });

      if (hasUpdates) {
        this._parentChanges.emit();
      }
    });

    const windowObj = this.windowRef.nativeWindow;
    const parent = this.findScrollableParent(element);
    const observedParent =
      parent === windowObj ? windowObj.document.body : parent;

    this.observer.observe(observedParent, {
      childList: true,
      subtree: true,
    });
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
      parent.parentNode &&
      parent !== bodyObj
    );

    if (parent === bodyObj) {
      return windowObj;
    }

    return parent;
  }

  private isElementScrolledInView(element: any, parentElement: any): boolean {
    const windowObj = this.windowRef.nativeWindow;

    if (parentElement === windowObj) {
      return (
        parentElement.pageYOffset + parentElement.innerHeight >
        element.offsetTop
      );
    }

    const elementRect = element.getBoundingClientRect();
    const parentRect = parentElement.getBoundingClientRect();

    return elementRect.top < parentRect.top + parentRect.height;
  }
}
