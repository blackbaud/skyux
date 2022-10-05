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
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';

import { SkyModalComponentAdapterService } from './modal-component-adapter.service';
import { SkyModalConfiguration } from './modal-configuration';
import { SkyModalHostService } from './modal-host.service';
import { SkyModalScrollShadowEventArgs } from './modal-scroll-shadow-event-args';

let skyModalUniqueIdentifier = 0;

const ARIA_ROLE_DEFAULT = 'dialog';

/**
 * Provides a common look-and-feel for modal content with options to display
 * a common modal header, specify body content, and display a common modal footer
 * and buttons.
 */
@Component({
  selector: 'sky-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [SkyModalComponentAdapterService, SkyDockService],
})
export class SkyModalComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class')
  public wrapperClass: string | undefined;

  // Ignoring coverage as we only use the setter internally and do not export the class externally for users to be able to use the getter.
  // istanbul ignore next
  /**
   * @internal
   */
  @Input()
  public get ariaRole() {
    return this.#_ariaRole;
  }

  public set ariaRole(value: string | undefined) {
    this.#_ariaRole = value;
    this.ariaRoleOrDefault = value || ARIA_ROLE_DEFAULT;
  }

  public ariaRoleOrDefault = ARIA_ROLE_DEFAULT;

  /**
   * @internal
   */
  @Input()
  public tiledBody: boolean | undefined;

  public ariaDescribedBy: string;

  public ariaLabelledBy: string;

  public helpKey: string | undefined;

  public modalState = 'in';

  public modalContentId: string =
    'sky-modal-content-id-' + skyModalUniqueIdentifier.toString();

  public modalHeaderId: string =
    'sky-modal-header-id-' + skyModalUniqueIdentifier.toString();

  public modalZIndex: number | undefined;

  public scrollShadow: SkyModalScrollShadowEventArgs | undefined;

  public size: string;

  @ViewChild('modalContentWrapper', { read: ElementRef })
  public modalContentWrapperElement: ElementRef | undefined;

  #hostService: SkyModalHostService;
  #elRef: ElementRef;
  #windowRef: SkyAppWindowRef;
  #componentAdapter: SkyModalComponentAdapterService;
  #coreAdapter: SkyCoreAdapterService;
  #dockService: SkyDockService;
  #mediaQueryService: SkyResizeObserverMediaQueryService | undefined;

  #_ariaRole: string | undefined;

  constructor(
    hostService: SkyModalHostService,
    config: SkyModalConfiguration,
    elRef: ElementRef,
    windowRef: SkyAppWindowRef,
    componentAdapter: SkyModalComponentAdapterService,
    coreAdapter: SkyCoreAdapterService,
    @Host() dockService: SkyDockService,
    @Optional()
    mediaQueryService?: SkyResizeObserverMediaQueryService
  ) {
    this.#hostService = hostService;
    this.#elRef = elRef;
    this.#windowRef = windowRef;
    this.#componentAdapter = componentAdapter;
    this.#coreAdapter = coreAdapter;
    this.#dockService = dockService;
    this.#mediaQueryService = mediaQueryService;

    this.ariaDescribedBy = config.ariaDescribedBy || this.modalContentId;
    this.ariaLabelledBy = config.ariaLabelledBy || this.modalHeaderId;
    this.ariaRole = config.ariaRole;
    this.helpKey = config.helpKey;
    this.tiledBody = config.tiledBody;
    this.wrapperClass = config.wrapperClass;

    this.size = config.fullPage
      ? 'full-page'
      : config.size?.toLowerCase() || 'medium';

    this.modalZIndex = this.#hostService.zIndex;
  }

  @HostListener('document:keyup', ['$event'])
  public onDocumentKeyUp(event: KeyboardEvent) {
    /* istanbul ignore else */
    /* sanity check */
    if (SkyModalHostService.openModalCount > 0) {
      const topModal = SkyModalHostService.topModal;
      if (topModal && topModal === this.#hostService) {
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
      if (topModal && topModal === this.#hostService) {
        if (event.which === 9) {
          // Tab pressed
          let focusChanged = false;

          const focusElementList = this.#coreAdapter.getFocusableChildren(
            this.#elRef.nativeElement
          );

          if (
            event.shiftKey &&
            (this.#componentAdapter.isFocusInFirstItem(
              event,
              focusElementList
            ) ||
              this.#componentAdapter.isModalFocused(event, this.#elRef))
          ) {
            focusChanged =
              this.#componentAdapter.focusLastElement(focusElementList);
          } else if (
            !event.shiftKey &&
            this.#componentAdapter.isFocusInLastItem(event, focusElementList)
          ) {
            focusChanged =
              this.#componentAdapter.focusFirstElement(focusElementList);
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
    this.#componentAdapter.handleWindowChange(this.#elRef);

    // Adding a timeout to avoid ExpressionChangedAfterItHasBeenCheckedError.
    // https://stackoverflow.com/questions/40562845
    this.#windowRef.nativeWindow.setTimeout(() => {
      this.#componentAdapter.modalOpened(this.#elRef);
    });

    this.#dockService.setDockOptions({
      location: SkyDockLocation.ElementBottom,
      referenceEl: this.modalContentWrapperElement!.nativeElement,
      zIndex: 5,
    });

    /* istanbul ignore next */
    if (this.#mediaQueryService) {
      this.#mediaQueryService.observe(this.modalContentWrapperElement!);
    }
  }

  public ngOnDestroy(): void {
    /* istanbul ignore next */
    if (this.#mediaQueryService) {
      this.#mediaQueryService.unobserve();
    }
  }

  public helpButtonClick() {
    if (this.helpKey) {
      this.#hostService.onOpenHelp(this.helpKey);
    }
  }

  public closeButtonClick() {
    this.#hostService.onClose();
  }

  public windowResize() {
    this.#componentAdapter.handleWindowChange(this.#elRef);
  }

  public scrollShadowChange(args: SkyModalScrollShadowEventArgs): void {
    this.scrollShadow = args;
  }

  public viewkeeperEnabled(): boolean {
    return this.#componentAdapter.modalContentHasDirectChildViewkeeper(
      this.#elRef
    );
  }
}
