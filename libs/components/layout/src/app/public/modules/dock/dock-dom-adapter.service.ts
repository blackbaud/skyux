import {
  ElementRef,
  Injectable,
  OnDestroy,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  MutationObserverService
} from '@skyux/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/observable/fromEvent';

import 'rxjs/add/operator/debounceTime';

/**
 * @internal
 */
@Injectable()
export class SkyDockDomAdapterService implements OnDestroy {

  private currentDockHeight: number;

  private ngUnsubscribe = new Subject<void>();

  private observer: MutationObserver;

  private renderer: Renderer2;

  private styleElement: HTMLStyleElement;

  constructor(
    private mutationService: MutationObserverService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();
    this.ngUnsubscribe.next();

    if (this.styleElement) {
      this.destroyStyleElement();
    }

    this.currentDockHeight =
    this.ngUnsubscribe =
    this.observer =
    this.styleElement = undefined;
  }

  public watchDomChanges(elementRef: ElementRef): void {
    this.observer = this.mutationService.create(() => {
      this.adjustBodyStyles(elementRef);
    });

    this.observer.observe(elementRef.nativeElement, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });

    Observable.fromEvent(window, 'resize')
      .debounceTime(250)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => this.adjustBodyStyles(elementRef));
  }

  private adjustBodyStyles(elementRef: ElementRef): void {
    const dockHeight = elementRef.nativeElement.getBoundingClientRect().height;
    if (dockHeight === this.currentDockHeight) {
      return;
    }

    // Create a style element to avoid overwriting any existing inline body styles.
    const styleElement = this.renderer.createElement('style');
    const textNode = this.renderer.createText(`body { margin-bottom: ${dockHeight}px; }`);

    // Apply a `data-` attribute to make unit testing easier.
    this.renderer.setAttribute(
      styleElement,
      'data-test-selector',
      'sky-layout-dock-bottom-styles'
    );

    this.renderer.appendChild(styleElement, textNode);
    this.renderer.appendChild(document.head, styleElement);

    if (this.styleElement) {
      this.destroyStyleElement();
    }

    this.currentDockHeight = dockHeight;
    this.styleElement = styleElement;
  }

  private destroyStyleElement(): void {
    this.renderer.removeChild(document.head, this.styleElement);
  }

}
