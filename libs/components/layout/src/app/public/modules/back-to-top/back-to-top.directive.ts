import {
  AfterViewInit,
  Directive,
  ElementRef,
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
  SkyBackToTopDomAdapterService
} from './back-to-top-adapter.service';

import {
  SkyBackToTopComponent
} from './back-to-top.component';

/**
 * Adds a back to top button to the page when the element is scrolled out of view.
 * When users click on the back to top button, the browser will scroll back to
 * the element this directive was placed on.
 */
@Directive({
  selector: '[skyBackToTop]',
  providers: [
    SkyBackToTopDomAdapterService
  ]
})
export class SkyBackToTopDirective implements AfterViewInit, OnDestroy {

  private dockItem: SkyDockItem<SkyBackToTopComponent>;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private dockService: SkyDockService,
    private domAdapter: SkyBackToTopDomAdapterService,
    private element: ElementRef
  ) {}

  public ngAfterViewInit(): void {
    this.setBackToTopListener();
  }

  public ngOnDestroy(): void {
    if (this.dockItem) {
      this.dockItem.destroy();
    }
  }

  private addBackToTop(): void {
    this.dockItem = this.dockService.insertComponent(SkyBackToTopComponent);

    // Listen for clicks on the "back to top" button so we know when to scroll up.
    this.dockItem.componentInstance.scrollToTopClick
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.domAdapter.scrollToElement(this.element);
      });
  }

  private setBackToTopListener(): void {
    if (this.element) {
      this.domAdapter.elementInViewOnScroll(this.element)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((elementInView: boolean) => {
          // Add back to top button if user scrolls down.
          if (!this.dockItem && !elementInView) {
            this.addBackToTop();
          }
          // Remove back to top button if user scrolls back up.
          if (elementInView) {
            this.destroyBackToTop();
          }
      });
    }
  }

  private destroyBackToTop(): void {
    if (this.dockItem) {
      this.dockItem.destroy();
      this.dockItem = undefined;
    }
  }
}
