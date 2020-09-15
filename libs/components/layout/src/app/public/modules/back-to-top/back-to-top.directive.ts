import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';

import {
  SkyDockItem,
  SkyDockService
} from '@skyux/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyBackToTopDomAdapterService
} from './back-to-top-adapter.service';

import {
  SkyBackToTopComponent
} from './back-to-top.component';

import {
  SkyBackToTopMessage
} from './models/back-to-top-message';

import {
  SkyBackToTopMessageType
} from './models/back-to-top-message-type';

import {
  SkyBackToTopOptions
} from './models/back-to-top-options';

/**
 * Associates a button with an element on the page and displays a button
 * to return to that element after users scroll away from it.
 */
@Directive({
  selector: '[skyBackToTop]',
  providers: [
    SkyBackToTopDomAdapterService
  ]
})
export class SkyBackToTopDirective implements AfterViewInit, OnDestroy {

  @Input()
  public set skyBackToTop(value: SkyBackToTopOptions) {
    this.buttonHidden = !!value?.buttonHidden;

    this.handleBackToTopButton(this.elementInView);
  }

  /**
   * Provides an observable to send commands to the back to top that respect the `SkyBackToTopMessage` type.
   */
  @Input()
  public set skyBackToTopMessageStream(value: Subject<SkyBackToTopMessage>) {
    if (this._skyBackToTopMessageStream) {
      this._skyBackToTopMessageStream.unsubscribe();
    }
    this._skyBackToTopMessageStream = value;
    this._skyBackToTopMessageStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: SkyBackToTopMessage) => this.handleIncomingMessages(message));
  }

  private buttonHidden = false;
  private dockItem: SkyDockItem<SkyBackToTopComponent>;
  private elementInView: boolean;

  private ngUnsubscribe = new Subject<void>();
  private _skyBackToTopMessageStream: Subject<SkyBackToTopMessage>;

  constructor(
    private dockService: SkyDockService,
    private domAdapter: SkyBackToTopDomAdapterService,
    private element: ElementRef
  ) {}

  public ngAfterViewInit(): void {
    const scrollableParent = this.domAdapter.findScrollableParent(this.element.nativeElement);
    this.elementInView = this.domAdapter.isElementScrolledInView(this.element.nativeElement, scrollableParent);

    this.handleBackToTopButton(this.elementInView);
    this.setBackToTopListeners();
  }

  public ngOnDestroy(): void {
    if (this.dockItem) {
      this.dockItem.destroy();
    }
  }

  private handleBackToTopButton(elementInView: boolean): void {
    // Add back to top button if user scrolls down and button is not hidden.
    if (!this.dockItem && elementInView !== undefined && !elementInView && !this.buttonHidden) {
      this.addBackToTop();
    }
    // Remove back to top button if user scrolls back up.
    if (elementInView) {
      this.destroyBackToTop();
    }
  }

  private addBackToTop(): void {
    this.dockItem = this.dockService.insertComponent(SkyBackToTopComponent);

    // Listen for clicks on the "back to top" button so we know when to scroll up.
    this.dockItem.componentInstance.scrollToTopClick
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.domAdapter.scrollToElement(this.element);
      });
  }

  private handleIncomingMessages(message: SkyBackToTopMessage): void {
    /* istanbul ignore else */
    if (message.type === SkyBackToTopMessageType.BackToTop) {
      this.domAdapter.scrollToElement(this.element);
    }
  }

  private setBackToTopListeners(): void {
    /* istanbul ignore else */
    if (this.element) {
      this.domAdapter.elementInViewOnScroll(this.element)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((elementInView: boolean) => {
          this.elementInView = elementInView;

          this.handleBackToTopButton(elementInView);
      });
    }
  }

  private destroyBackToTop(): void {
    /* istanbul ignore else */
    if (this.dockItem) {
      this.dockItem.destroy();
      this.dockItem = undefined;
    }
  }
}
