import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { SkyAppWindowRef, SkyMutationObserverService } from '@skyux/core';

import { Subject, fromEvent } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

/**
 * Adapter service for use when the split view component needs to manipulate the DOM
 * @internal
 */
@Injectable()
export class SkySplitViewAdapterService {
  #observer: MutationObserver | undefined;
  #renderer: Renderer2;
  #observerSvc: SkyMutationObserverService;
  #rendererFactory: RendererFactory2;
  #windowRef: SkyAppWindowRef;

  constructor(
    observerSvc: SkyMutationObserverService,
    rendererFactory: RendererFactory2,
    windowRef: SkyAppWindowRef,
  ) {
    this.#observerSvc = observerSvc;
    this.#rendererFactory = rendererFactory;
    this.#windowRef = windowRef;

    this.#renderer = this.#rendererFactory.createRenderer(undefined, null);
  }

  public bindHeightToWindow(
    elementRef: ElementRef,
    unsubscribeSubject: Subject<void>,
  ): void {
    /*istanbul ignore else*/
    if (elementRef.nativeElement.offsetParent === document.body) {
      this.#observer = this.#observerSvc.create(() => {
        this.#setSplitViewBoundHeights(elementRef);
      });

      fromEvent(this.#windowRef.nativeWindow, 'resize')
        .pipe(takeUntil(unsubscribeSubject))
        .subscribe(() => {
          this.#setSplitViewBoundHeights(elementRef);
        });

      const config = {
        attributes: true,
        attributeFilter: ['style'],
        childList: false,
        characterDate: false,
      };

      // This observer makes sure that the split view reacts if the body styling is change but thing
      // such as the action bar.
      this.#observer.observe(document.body, config);
      this.#setSplitViewBoundHeights(elementRef);

      unsubscribeSubject.pipe(take(1)).subscribe(() => {
        this.#observer?.disconnect();
        const splitViewElement =
          elementRef.nativeElement.querySelector('.sky-split-view');
        this.#renderer.removeStyle(splitViewElement, 'max-height');
        this.#renderer.removeStyle(splitViewElement, 'min-height');
      });
    }
  }

  #setSplitViewBoundHeights(elementRef: ElementRef): void {
    const splitViewElement =
      elementRef.nativeElement.querySelector('.sky-split-view');
    const offsetTop = splitViewElement.offsetTop;
    const marginBottom = document.body.style.marginBottom
      ? document.body.style.marginBottom
      : '0px';
    this.#renderer.setStyle(
      splitViewElement,
      'max-height',
      'calc(100vh - ' + offsetTop + 'px - ' + marginBottom + ')',
    );
    this.#renderer.setStyle(splitViewElement, 'min-height', '300px');
  }
}
