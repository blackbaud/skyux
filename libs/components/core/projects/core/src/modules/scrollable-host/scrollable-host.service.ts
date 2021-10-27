import { ElementRef, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { take } from "rxjs/operators";
import { MutationObserverService } from "../mutation/mutation-observer-service";
import { SkyAppWindowRef } from "../window/window-ref";

@Injectable({
  providedIn: 'root'
})
export class SkyScrollableHostService {

  constructor(
    private mutationObserverSvc: MutationObserverService,
    private windowRef: SkyAppWindowRef
  ) { }

  public getScrollabeHost(elementRef: ElementRef): HTMLElement | Window {
    return this.findScrollableHost(elementRef.nativeElement);
  }

  public watchScrollableHost(elementRef: ElementRef, completionObservable: Observable<void>): Observable<HTMLElement | Window> {
    let scrollableHost = this.findScrollableHost(elementRef.nativeElement);
    let behaviorSubject = new BehaviorSubject(scrollableHost);

    const mutationObserver = this.mutationObserverSvc.create(() => {
      let newScrollableHost = this.findScrollableHost(elementRef.nativeElement);

      if (newScrollableHost !== scrollableHost) {
        scrollableHost = newScrollableHost;
        this.observeForScrollableHostChanges(scrollableHost, mutationObserver);
        behaviorSubject.next(scrollableHost);
      }
    });
    this.observeForScrollableHostChanges(scrollableHost, mutationObserver);

    completionObservable.pipe(take(1)).subscribe(() => {
      mutationObserver.disconnect();
    })

    return behaviorSubject;
  }

  private findScrollableHost(element: any): HTMLElement | Window {
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

  private observeForScrollableHostChanges(element: HTMLElement | Window, mutationObserver: MutationObserver) {
    mutationObserver.disconnect();
    if (element instanceof HTMLElement) {
      mutationObserver.observe(element, {
        attributes: true,
        attributeFilter: ["class", "style.overflow", "style.overflow-y"],
        subtree: true
      });
    } else {
      mutationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style.overflow", "style.overflow-y"],
        subtree: true
      });
    }
  }

}
