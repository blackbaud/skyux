import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  ViewChild,
  inject,
} from '@angular/core';
import {
  SkyAppWindowRef,
  SkyCoreAdapterService,
  SkyDockLocation,
  SkyDockService,
  SkyLiveAnnouncer,
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';

import { Subscription } from 'rxjs';

import { SkyModalComponentAdapterService } from './modal-component-adapter.service';
import { SkyModalConfiguration } from './modal-configuration';
import { SkyModalHostService } from './modal-host.service';
import { SkyModalScrollShadowEventArgs } from './modal-scroll-shadow-event-args';

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

  /**
   * @internal
   */
  @Input()
  public set ariaRole(value: string | undefined) {
    this.ariaRoleOrDefault = value || ARIA_ROLE_DEFAULT;
  }

  public ariaRoleOrDefault = ARIA_ROLE_DEFAULT;

  /**
   * @internal
   */
  @Input()
  public tiledBody: boolean | undefined;

  /**
   * @internal
   */
  @Input()
  public set ariaDescribedBy(id: string | undefined) {
    this.#_ariaDescribedBy = id;
  }

  public get ariaDescribedBy(): string | undefined {
    return this.#_ariaDescribedBy;
  }

  /**
   * @internal
   */
  @Input()
  public set ariaLabelledBy(id: string | undefined) {
    this.#_ariaLabelledBy = id;
  }

  public get ariaLabelledBy(): string | undefined {
    return this.#_ariaLabelledBy;
  }

  public ariaOwns: string | null = null;

  public helpKey: string | undefined;

  public modalState = 'in';

  public modalZIndex: number | undefined;

  public scrollShadow: SkyModalScrollShadowEventArgs | undefined;

  public size: string;

  @ViewChild('modalContentWrapper', { read: ElementRef })
  public modalContentWrapperElement: ElementRef | undefined;

  #hostService: SkyModalHostService;
  #elRef: ElementRef;
  #windowRef: SkyAppWindowRef;
  #changeDetector = inject(ChangeDetectorRef);
  #componentAdapter: SkyModalComponentAdapterService;
  #coreAdapter: SkyCoreAdapterService;
  #dockService: SkyDockService;
  #liveAnnouncerElementSubscription: Subscription;
  #mediaQueryService: SkyResizeObserverMediaQueryService | undefined;

  #_ariaDescribedBy: string | undefined;
  #_ariaLabelledBy: string | undefined;

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

    this.ariaDescribedBy = config.ariaDescribedBy;
    this.ariaLabelledBy = config.ariaLabelledBy;
    this.ariaRole = config.ariaRole;
    this.helpKey = config.helpKey;
    this.tiledBody = config.tiledBody;
    this.wrapperClass = config.wrapperClass;

    this.#liveAnnouncerElementSubscription =
      SkyLiveAnnouncer.announcerElementChanged.subscribe((element) => {
        if (element?.id) {
          this.ariaOwns = element.id;
          this.#changeDetector.markForCheck();
        }
      });

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
    this.#liveAnnouncerElementSubscription.unsubscribe();
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
