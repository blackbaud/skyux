import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { SkyDockItem, SkyDockService } from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyBackToTopDomAdapterService } from './back-to-top-adapter.service';
import { SkyBackToTopComponent } from './back-to-top.component';
import { SkyBackToTopMessage } from './models/back-to-top-message';
import { SkyBackToTopMessageType } from './models/back-to-top-message-type';
import { SkyBackToTopOptions } from './models/back-to-top-options';

/**
 * Associates a button with an element on the page and displays that button
 * to return to the element after users scroll away.
 */
@Directive({
  selector: '[skyBackToTop]',
  providers: [SkyBackToTopDomAdapterService],
  standalone: false,
})
export class SkyBackToTopDirective implements AfterViewInit, OnDestroy {
  /**
   * Configuration options for the back to top component.
   */
  @Input()
  public set skyBackToTop(value: SkyBackToTopOptions | '' | undefined) {
    this.#buttonHidden = !!(value && value?.buttonHidden);

    this.#handleBackToTopButton(this.#elementInView);
  }

  /**
   * The observable to send commands to the back to top component.
   * The commands respect the `SkyBackToTopMessage` type.
   */
  @Input()
  public set skyBackToTopMessageStream(
    value: Subject<SkyBackToTopMessage> | undefined,
  ) {
    if (this.#_skyBackToTopMessageStream) {
      this.#_skyBackToTopMessageStream.unsubscribe();
    }
    this.#_skyBackToTopMessageStream = value;
    this.#_skyBackToTopMessageStream
      ?.pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message: SkyBackToTopMessage) =>
        this.#handleIncomingMessages(message),
      );
  }

  #buttonHidden = false;
  #dockItem: SkyDockItem<SkyBackToTopComponent> | undefined;
  #dockService: SkyDockService;
  #domAdapter: SkyBackToTopDomAdapterService;
  #elementInView = false;
  #elementRef: ElementRef;

  #ngUnsubscribe = new Subject<void>();
  #_skyBackToTopMessageStream: Subject<SkyBackToTopMessage> | undefined;

  constructor(
    dockService: SkyDockService,
    domAdapter: SkyBackToTopDomAdapterService,
    elementRef: ElementRef,
  ) {
    this.#dockService = dockService;
    this.#domAdapter = domAdapter;
    this.#elementRef = elementRef;
  }

  public ngAfterViewInit(): void {
    this.#elementInView = this.#domAdapter.isElementScrolledInView(
      this.#elementRef,
    );

    this.#handleBackToTopButton(this.#elementInView);
    this.#setBackToTopListeners();
  }

  public ngOnDestroy(): void {
    if (this.#dockItem) {
      this.#dockItem.destroy();
    }
  }

  #handleBackToTopButton(elementInView: boolean): void {
    // Add back to top button if user scrolls down and button is not hidden.
    if (
      !this.#dockItem &&
      elementInView !== undefined &&
      !elementInView &&
      !this.#buttonHidden
    ) {
      this.#addBackToTop();
    }
    // Remove back to top button if user scrolls back up.
    if (elementInView || this.#buttonHidden) {
      this.#destroyBackToTop();
    }
  }

  #addBackToTop(): void {
    this.#dockItem = this.#dockService.insertComponent(SkyBackToTopComponent);

    // Listen for clicks on the "back to top" button so we know when to scroll up.
    this.#dockItem.componentInstance.scrollToTopClick
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#domAdapter.scrollToElement(this.#elementRef);
      });
  }

  #handleIncomingMessages(message: SkyBackToTopMessage): void {
    /* istanbul ignore else */
    if (message.type === SkyBackToTopMessageType.BackToTop) {
      this.#domAdapter.scrollToElement(this.#elementRef);
    }
  }

  #setBackToTopListeners(): void {
    /* istanbul ignore else */
    if (this.#elementRef) {
      this.#domAdapter
        .elementInViewOnScroll(this.#elementRef)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((elementInView: boolean) => {
          this.#elementInView = elementInView;

          this.#handleBackToTopButton(elementInView);
        });
    }
  }

  #destroyBackToTop(): void {
    /* istanbul ignore else */
    if (this.#dockItem) {
      this.#dockItem.destroy();
      this.#dockItem = undefined;
    }
  }
}
