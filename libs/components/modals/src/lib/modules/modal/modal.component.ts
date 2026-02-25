import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
  input,
} from '@angular/core';
import {
  SkyCoreAdapterService,
  SkyDockLocation,
  SkyDockService,
  SkyIdModule,
  SkyLayoutHostDirective,
  SkyLiveAnnouncerService,
  SkyScrollShadowDirective,
  SkyScrollShadowEventArgs,
} from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyTheme, SkyThemeModule, SkyThemeService } from '@skyux/theme';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyModalsResourcesModule } from '../shared/sky-modals-resources.module';

import { SkyModalComponentAdapterService } from './modal-component-adapter.service';
import { SkyModalConfiguration } from './modal-configuration';
import { SkyModalError } from './modal-error';
import { SkyModalErrorsService } from './modal-errors.service';
import { SkyModalHeaderInternal } from './modal-header-internal';
import { SkyModalHostService } from './modal-host.service';

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
  imports: [
    CommonModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyLayoutHostDirective,
    SkyModalHeaderInternal,
    SkyModalsResourcesModule,
    SkyScrollShadowDirective,
    SkyThemeModule,
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
   * The text to display as the modal's heading.
   */
  @Input()
  public headingText: string | undefined;

  /**
   * A help key that identifies the global help content to display. When specified along with `headingText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline) button is
   * added to the modal header. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help) as configured by the application. This property only applies when `headingText` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * The content of the help popover. When specified along with `headingText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the modal header. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `headingText` is also specified.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * Used by the confirm component to set a different role for the modal.
   * @internal
   */
  @Input()
  public set ariaRole(value: string | undefined) {
    this.ariaRoleOrDefault = value || ARIA_ROLE_DEFAULT;
  }

  public ariaRoleOrDefault = ARIA_ROLE_DEFAULT;

  /**
   * @internal
   * @deprecated
   */
  @Input()
  public tiledBody: boolean | undefined;

  /**
   * Used by the confirm component to set descriptive text without using a
   * modal header.
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
   * Used by the confirm component to set descriptive text without using a
   * modal header.
   * @internal
   */
  @Input()
  public set ariaLabelledBy(id: string | undefined) {
    this.#_ariaLabelledBy = id;
  }

  public get ariaLabelledBy(): string | undefined {
    return this.#_ariaLabelledBy;
  }

  public readonly layout = input<'none' | 'fit'>('none');

  public ariaOwns: string | null = null;

  /**
   * @deprecated
   */
  public legacyHelpKey: string | undefined;

  public modalState = 'in';

  public modalZIndex: number | undefined;

  public scrollShadow: SkyScrollShadowEventArgs = {
    bottomShadow: 'none',
    topShadow: 'none',
  };

  public size: string;

  @ViewChild('modalContentWrapper', { read: ElementRef })
  public modalContentWrapperElement: ElementRef | undefined;

  protected scrollShadowEnabled = false;

  #ngUnsubscribe = new Subject<void>();

  #_ariaDescribedBy: string | undefined;
  #_ariaLabelledBy: string | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #componentAdapter = inject(SkyModalComponentAdapterService);
  readonly #coreAdapter = inject(SkyCoreAdapterService);
  readonly #dockService = inject(SkyDockService, { host: true });
  readonly #elRef = inject(ElementRef);
  readonly #errorsSvc = inject(SkyModalErrorsService);
  readonly #hostService = inject(SkyModalHostService);
  readonly #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);

  /**
   * This provider is optional to account for situations where a modal component
   * is implemented without the modal service. For example, when a consumer tests
   * a component that uses the modal component but doesn't launch the modal from
   * the modal service before executing assertions.
   */
  readonly #config =
    inject(SkyModalConfiguration, { optional: true }) ??
    new SkyModalConfiguration();
  readonly #themeSvc = inject(SkyThemeService, { optional: true });

  constructor() {
    this.ariaDescribedBy = this.#config.ariaDescribedBy;
    this.ariaLabelledBy = this.#config.ariaLabelledBy;
    this.ariaRole = this.#config.ariaRole;
    this.legacyHelpKey = this.#config.helpKey;
    this.tiledBody = this.#config.tiledBody;
    this.wrapperClass = this.#config.wrapperClass;

    this.size = this.#config.fullPage
      ? 'full-page'
      : this.#config.size?.toLowerCase() || 'medium';

    this.modalZIndex = this.#hostService.zIndex;
  }

  @HostListener('document:keyup', ['$event'])
  public onDocumentKeyUp(event: KeyboardEvent): void {
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
  public onDocumentKeyDown(event: KeyboardEvent): void {
    /* istanbul ignore else */
    /* sanity check */
    if (SkyModalHostService.openModalCount > 0) {
      const topModal = SkyModalHostService.topModal;
      if (topModal && topModal === this.#hostService) {
        if (event.which === 9) {
          // Tab pressed
          let focusChanged = false;

          const focusElementList = this.#coreAdapter.getFocusableChildren(
            this.#elRef.nativeElement,
          );

          if (
            event.shiftKey &&
            (this.#componentAdapter.isFocusInFirstItem(
              event,
              focusElementList,
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

    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((themeSettings) => {
          this.scrollShadowEnabled =
            themeSettings.currentSettings.theme === SkyTheme.presets.modern;
        });
    }
  }

  public ngAfterViewInit(): void {
    this.#componentAdapter.handleWindowChange(this.#elRef);

    this.#dockService.setDockOptions({
      location: SkyDockLocation.ElementBottom,
      referenceEl: this.modalContentWrapperElement!.nativeElement,
      zIndex: 5,
    });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * @deprecated
   */
  public helpButtonClick(): void {
    if (this.legacyHelpKey) {
      this.#hostService.onOpenHelp(this.legacyHelpKey);
    }
  }

  public closeButtonClick(): void {
    this.#hostService.onClose();
  }

  public windowResize(): void {
    this.#componentAdapter.handleWindowChange(this.#elRef);
  }

  public scrollShadowChange(args: SkyScrollShadowEventArgs): void {
    this.scrollShadow = args;
  }

  public viewkeeperEnabled(): boolean {
    return this.#componentAdapter.modalContentHasDirectChildViewkeeper(
      this.#elRef,
    );
  }
}
