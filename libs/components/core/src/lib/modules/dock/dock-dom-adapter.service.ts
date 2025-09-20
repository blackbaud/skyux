import {
  ElementRef,
  Injectable,
  OnDestroy,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import { Subject, fromEvent as observableFromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { SkyMutationObserverService } from '../mutation/mutation-observer-service';

/**
 * @internal
 */
@Injectable()
export class SkyDockDomAdapterService implements OnDestroy {
  #currentDockHeight: number | undefined;

  #mutationSvc: SkyMutationObserverService;

  #ngUnsubscribe = new Subject<void>();

  #observer: MutationObserver | undefined;

  #renderer: Renderer2;

  #styleElement: HTMLStyleElement | undefined;

  constructor(
    mutationSvc: SkyMutationObserverService,
    rendererFactory: RendererFactory2,
  ) {
    this.#mutationSvc = mutationSvc;
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public ngOnDestroy(): void {
    if (this.#observer) {
      this.#observer.disconnect();
    }
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    if (this.#styleElement) {
      this.#destroyStyleElement();
    }

    this.#currentDockHeight = this.#observer = this.#styleElement = undefined;
  }

  public setSticky(elementRef: ElementRef): void {
    this.#renderer.addClass(elementRef.nativeElement, 'sky-dock-sticky');
  }

  public setZIndex(zIndex: number, elementRef: ElementRef): void {
    this.#renderer.setStyle(elementRef.nativeElement, 'z-index', zIndex);
  }

  public unbindDock(elementRef: ElementRef): void {
    this.#renderer.addClass(elementRef.nativeElement, 'sky-dock-unbound');
  }

  public watchDomChanges(elementRef: ElementRef): void {
    this.#observer = this.#mutationSvc.create(() => {
      this.#adjustBodyStyles(elementRef);
    });

    this.#observer.observe(elementRef.nativeElement, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });

    observableFromEvent(window, 'resize')
      .pipe(debounceTime(250), takeUntil(this.#ngUnsubscribe))
      .subscribe(() => this.#adjustBodyStyles(elementRef));
  }

  #adjustBodyStyles(elementRef: ElementRef): void {
    const dockHeight = elementRef.nativeElement.getBoundingClientRect().height;
    if (dockHeight === this.#currentDockHeight) {
      return;
    }

    // Create a style element to avoid overwriting any existing inline body styles.
    const styleElement = this.#renderer.createElement('style');
    const textNode = this.#renderer.createText(
      `body { margin-bottom: ${dockHeight}px; --sky-dock-height: ${dockHeight}px; }`,
    );

    // Apply a `data-` attribute to make unit testing easier.
    this.#renderer.setAttribute(
      styleElement,
      'data-test-selector',
      'sky-layout-dock-bottom-styles',
    );

    this.#renderer.appendChild(styleElement, textNode);
    this.#renderer.appendChild(document.head, styleElement);

    if (this.#styleElement) {
      this.#destroyStyleElement();
    }

    this.#currentDockHeight = dockHeight;
    this.#styleElement = styleElement;
  }

  #destroyStyleElement(): void {
    this.#renderer.removeChild(document.head, this.#styleElement);
  }
}
