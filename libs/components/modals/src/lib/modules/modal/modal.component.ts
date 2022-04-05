import {
  AfterViewInit,
  Component,
  ElementRef,
  Host,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  ViewChild,
} from '@angular/core';
import {
  SkyAppWindowRef,
  SkyCoreAdapterService,
  SkyDockLocation,
  SkyDockService,
  SkyMediaQueryService,
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';

import { SkyModalComponentAdapterService } from './modal-component-adapter.service';
import { SkyModalConfiguration } from './modal-configuration';
import { SkyModalHostService } from './modal-host.service';
import { SkyModalScrollShadowEventArgs } from './modal-scroll-shadow-event-args';
import { skyAnimationModalState } from './modal-state-animation';

let skyModalUniqueIdentifier = 0;

/**
 * Provides a common look-and-feel for modal content with options to display
 * a common modal header, specify body content, and display a common modal footer
 * and buttons. For information about how to test modals in SKY UX, see
 * [write unit tests for modals](https://developer.blackbaud.com/skyux/learn/accessibility/test).
 */
@Component({
  selector: 'sky-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [skyAnimationModalState],
  providers: [
    SkyModalComponentAdapterService,
    SkyDockService,
    {
      provide: SkyMediaQueryService,
      useExisting: SkyResizeObserverMediaQueryService,
    },
  ],
})
export class SkyModalComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class')
  public get wrapperClass(): string {
    return this.config.wrapperClass;
  }

  /**
   * @internal
   */
  @Input()
  public get ariaRole() {
    return this.config.ariaRole || 'dialog';
  }
  public set ariaRole(value: string) {
    this.config.ariaRole = value;
  }

  /**
   * @internal
   */
  @Input()
  public set tiledBody(value: boolean) {
    this.config.tiledBody = value;
  }

  public get modalZIndex() {
    return this.hostService.getModalZIndex();
  }

  public get modalFullPage() {
    return this.config.fullPage;
  }

  public get isSmallSize() {
    return !this.modalFullPage && this.isSizeEqual(this.config.size, 'small');
  }

  public get isMediumSize() {
    return !this.modalFullPage && !(this.isSmallSize || this.isLargeSize);
  }

  public get isLargeSize() {
    return !this.modalFullPage && this.isSizeEqual(this.config.size, 'large');
  }

  public get isTiledBody() {
    return this.config.tiledBody;
  }

  public get ariaDescribedBy() {
    return this.config.ariaDescribedBy || this.modalContentId;
  }

  public get ariaLabelledBy() {
    return this.config.ariaLabelledBy || this.modalHeaderId;
  }

  public get helpKey() {
    return this.config.helpKey;
  }

  public modalState = 'in';

  public modalContentId: string =
    'sky-modal-content-id-' + skyModalUniqueIdentifier.toString();

  public modalHeaderId: string =
    'sky-modal-header-id-' + skyModalUniqueIdentifier.toString();

  public scrollShadow: SkyModalScrollShadowEventArgs;

  @ViewChild('modalContentWrapper', { read: ElementRef })
  private modalContentWrapperElement: ElementRef;

  constructor(
    private hostService: SkyModalHostService,
    private config: SkyModalConfiguration,
    private elRef: ElementRef,
    private windowRef: SkyAppWindowRef,
    private componentAdapter: SkyModalComponentAdapterService,
    private coreAdapter: SkyCoreAdapterService,
    @Host() private dockService: SkyDockService,
    @Optional() @Host() private mediaQueryService?: SkyMediaQueryService
  ) {}

  @HostListener('document:keyup', ['$event'])
  public onDocumentKeyUp(event: KeyboardEvent) {
    /* istanbul ignore else */
    /* sanity check */
    if (SkyModalHostService.openModalCount > 0) {
      const topModal = SkyModalHostService.topModal;
      if (topModal && topModal === this.hostService) {
        if (event.which === 27) {
          // Escape key up
          event.preventDefault();
          this.closeButtonClick();
        }
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  public onDocumentKeyDown(event: KeyboardEvent) {
    /* istanbul ignore else */
    /* sanity check */
    if (SkyModalHostService.openModalCount > 0) {
      const topModal = SkyModalHostService.topModal;
      if (topModal && topModal === this.hostService) {
        if (event.which === 9) {
          // Tab pressed
          let focusChanged = false;

          const focusElementList = this.coreAdapter.getFocusableChildren(
            this.elRef.nativeElement
          );

          if (
            event.shiftKey &&
            (this.componentAdapter.isFocusInFirstItem(
              event,
              focusElementList
            ) ||
              this.componentAdapter.isModalFocused(event, this.elRef))
          ) {
            focusChanged =
              this.componentAdapter.focusLastElement(focusElementList);
          } else if (
            !event.shiftKey &&
            this.componentAdapter.isFocusInLastItem(event, focusElementList)
          ) {
            focusChanged =
              this.componentAdapter.focusFirstElement(focusElementList);
          }

          if (focusChanged) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }
    }
  }

  public ngAfterViewInit() {
    skyModalUniqueIdentifier++;
    this.componentAdapter.handleWindowChange(this.elRef);

    // Adding a timeout to avoid ExpressionChangedAfterItHasBeenCheckedError.
    // https://stackoverflow.com/questions/40562845
    this.windowRef.nativeWindow.setTimeout(() => {
      this.componentAdapter.modalOpened(this.elRef);
    });

    this.dockService.setDockOptions({
      location: SkyDockLocation.ElementBottom,
      referenceEl: this.modalContentWrapperElement.nativeElement,
      zIndex: 5,
    });

    (this.mediaQueryService as SkyResizeObserverMediaQueryService).observe(
      this.modalContentWrapperElement
    );
  }

  public ngOnDestroy(): void {
    if (this.mediaQueryService) {
      (
        this.mediaQueryService as SkyResizeObserverMediaQueryService
      ).unobserve();
    }
  }

  public helpButtonClick() {
    this.hostService.onOpenHelp(this.helpKey);
  }

  public closeButtonClick() {
    this.hostService.onClose();
  }

  public windowResize() {
    this.componentAdapter.handleWindowChange(this.elRef);
  }

  public scrollShadowChange(args: SkyModalScrollShadowEventArgs): void {
    this.scrollShadow = args;
  }

  private isSizeEqual(actualSize: string, size: string) {
    return actualSize && actualSize.toLowerCase() === size;
  }
}
