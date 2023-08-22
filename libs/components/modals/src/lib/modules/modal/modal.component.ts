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
  OnInit,
  Optional,
  ViewChild,
  inject,
} from '@angular/core';
import {
  SkyAppWindowRef,
  SkyCoreAdapterService,
  SkyDockLocation,
  SkyDockService,
  SkyLiveAnnouncerService,
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyModalComponentAdapterService } from './modal-component-adapter.service';
import { SkyModalConfiguration } from './modal-configuration';
import { SkyModalError } from './modal-error';
import { SkyModalErrorsService } from './modal-errors.service';
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
  providers: [
    SkyModalComponentAdapterService,
    SkyModalErrorsService,
    SkyDockService,
  ],
})
export class SkyModalComponent implements AfterViewInit, OnDestroy, OnInit {
  @HostBinding('class')
  public wrapperClass: string | undefined;

  /**
   * A list of form-level errors to display to the user.
   */
  @Input()
  public set formErrors(value: SkyModalError[] | undefined) {
    this.#errorsSvc.updateErrors(value);
  }

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
  #componentAdapter: SkyModalComponentAdapterService;
  #coreAdapter: SkyCoreAdapterService;
  #dockService: SkyDockService;
  #mediaQueryService: SkyResizeObserverMediaQueryService | undefined;
  #ngUnsubscribe = new Subject<void>();

  #_ariaDescribedBy: string | undefined;
  #_ariaLabelledBy: string | undefined;

  #changeDetector = inject(ChangeDetectorRef);
  #errorsSvc = inject(SkyModalErrorsService);
  #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);

  /**
   * This provider is optional to account for situations where a modal component
   * is implemented without the modal service. For example, when a consumer tests
   * a component that uses the modal component but doesn't launch the modal from
   * the modal service before executing assertions.
   */
  #config =
    inject(SkyModalConfiguration, { optional: true }) ??
    new SkyModalConfiguration();

  constructor(
    hostService: SkyModalHostService,
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

    this.ariaDescribedBy = this.#config.ariaDescribedBy;
    this.ariaLabelledBy = this.#config.ariaLabelledBy;
    this.ariaRole = this.#config.ariaRole;
    this.helpKey = this.#config.helpKey;
    this.tiledBody = this.#config.tiledBody;
    this.wrapperClass = this.#config.wrapperClass;

    this.size = this.#config.fullPage
      ? 'full-page'
      : this.#config.size?.toLowerCase() || 'medium';

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

  public ngOnInit(): void {
    this.#liveAnnouncerSvc.announcerElementChanged
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((element) => {
        if (element?.id) {
          this.ariaOwns = element.id;
          this.#changeDetector.markForCheck();
        }
      });
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
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
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
