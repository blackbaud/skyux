import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EnvironmentInjector,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import {
  SKY_STACKING_CONTEXT,
  SkyAffixAutoFitContext,
  SkyAffixHorizontalAlignment,
  SkyAffixService,
  SkyAffixer,
  SkyContentInfoProvider,
  SkyIdService,
  SkyOverlayInstance,
  SkyOverlayService,
} from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { parseAffixHorizontalAlignment } from './dropdown-extensions';
import { SkyDropdownTriggerDirective } from './dropdown-trigger.directive';
import { SkyDropdownButtonStyleType } from './types/dropdown-button-style-type';
import { SkyDropdownButtonType } from './types/dropdown-button-type';
import { SkyDropdownHorizontalAlignment } from './types/dropdown-horizontal-alignment';
import { SkyDropdownMessage } from './types/dropdown-message';
import { SkyDropdownMessageType } from './types/dropdown-message-type';
import { SkyDropdownTriggerType } from './types/dropdown-trigger-type';

const DEFAULT_BUTTON_STYLE: SkyDropdownButtonStyleType = 'default';
const DEFAULT_BUTTON_TYPE: SkyDropdownButtonType = 'select';
const DEFAULT_HORIZONTAL_ALIGNMENT: SkyAffixHorizontalAlignment = 'left';
const DEFAULT_TRIGGER_TYPE: SkyDropdownTriggerType = 'click';

/**
 * Creates a dropdown menu that displays menu items that users may select.
 */
@Component({
  selector: 'sky-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDropdownComponent implements OnInit, OnDestroy {
  readonly #affixService = inject(SkyAffixService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #idSvc = inject(SkyIdService);
  readonly #overlayService = inject(SkyOverlayService);
  readonly #themeSvc = inject(SkyThemeService, { optional: true });
  readonly #zIndex = inject(SKY_STACKING_CONTEXT, { optional: true })?.zIndex;
  readonly #contentInfoProvider = inject(SkyContentInfoProvider, {
    optional: true,
  });

  /**
   * The background color for the dropdown button. Available values are `default`,
   * `primary`, and `link`. These values set the background color and hover behavior from the
   * [secondary and primary button classes](https://developer.blackbaud.com/skyux/components/button) respectively.
   * @default "default"
   */
  @Input()
  public set buttonStyle(value: SkyDropdownButtonStyleType | undefined) {
    this.#_buttonStyle = value ?? DEFAULT_BUTTON_STYLE;
  }

  public get buttonStyle(): SkyDropdownButtonStyleType {
    return this.#_buttonStyle;
  }

  /**
   * The type of button to render as the dropdown's trigger element. To display a button
   * with a caret, specify `'select'` and render the button text or icon in a
   * `sky-dropdown-button` element. To display a round button with an ellipsis, specify
   * `'context-menu'`.
   * @default "select"
   */
  @Input()
  public set buttonType(value: SkyDropdownButtonType | undefined) {
    this.#_buttonType = value ?? DEFAULT_BUTTON_TYPE;
  }

  public get buttonType(): SkyDropdownButtonType {
    return this.#_buttonType;
  }

  /**
   * Whether to disable the dropdown button.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = value;
    this.#updateTrigger();
  }

  public get disabled(): boolean | undefined {
    return this.#_disabled;
  }

  /**
   * The ARIA label for the dropdown. This sets the dropdown's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility). If multiple dropdowns with no label or the same label appear on the same page,
   * they must have unique ARIA labels that provide context, such as "Context menu for Robert Hernandez" or "Edit Robert Hernandez."
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public set label(value: string | undefined) {
    this.#_label = value;
    this.#updateTrigger();
  }

  public get label(): string | undefined {
    return this.#_label;
  }

  protected readonly contentInfoObs = this.#contentInfoProvider?.getInfo();

  /**
   * The horizontal alignment of the dropdown menu in relation to the dropdown button.
   * @default "left"
   */
  @Input()
  public set horizontalAlignment(
    value: SkyDropdownHorizontalAlignment | undefined,
  ) {
    this.#_horizontalAlignment = value ?? DEFAULT_HORIZONTAL_ALIGNMENT;
  }

  public get horizontalAlignment(): SkyDropdownHorizontalAlignment {
    return this.#_horizontalAlignment;
  }

  /**
   * The observable that sends commands to the dropdown. The commands should respect
   * the [[SkyDropdownMessage]] type.
   * @internal
   */
  @Input()
  public messageStream: Subject<SkyDropdownMessage> | undefined =
    new Subject<SkyDropdownMessage>();

  /**
   * The title to display in a tooltip when users hover the mouse over the dropdown button.
   */
  @Input()
  public set title(value: string | undefined) {
    this.#_title = value;
    this.#updateTrigger();
  }

  public get title(): string | undefined {
    return this.#_title;
  }

  /**
   * How users interact with the dropdown button to expose the dropdown menu.
   * We recommend the default `click` value because the `hover` value can pose
   * [accessibility](https://developer.blackbaud.com/skyux/learn/accessibility) issues
   * for users on touch devices such as phones and tablets.
   * @deprecated We recommend against using this property. If you choose to use the deprecated
   * `hover` value anyway, we recommend that you not use it in combination with the `title`
   * property.
   * @default "click"
   */
  @Input()
  public set trigger(value: SkyDropdownTriggerType | undefined) {
    this.#_trigger = value ?? DEFAULT_TRIGGER_TYPE;
  }

  public get trigger(): SkyDropdownTriggerType {
    return this.#_trigger;
  }

  public set isOpen(value: boolean) {
    this.#_isOpen = value;
    this.#updateTrigger();
    this.#changeDetector.markForCheck();
  }

  public get isOpen(): boolean {
    return this.#_isOpen;
  }

  @ViewChild('menuContainerElementRef', {
    read: ElementRef,
  })
  public set menuContainerElementRef(value: ElementRef | undefined) {
    if (value) {
      this.#destroyAffixer();
      this.#createAffixer(value);
    }
  }

  public set menuId(value: string | undefined) {
    this.#_menuId = value;
    this.#updateTrigger();
  }

  public get menuId(): string | undefined {
    return this.#_menuId;
  }

  public set menuAriaRole(value: string | undefined) {
    this.#_menuAriaRole = value;
    this.#updateTrigger();
  }

  public get menuAriaRole(): string | undefined {
    return this.#_menuAriaRole;
  }

  public isMouseEnter = false;

  public isVisible = false;

  @ViewChild('menuContainerTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public menuContainerTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('triggerButton', {
    read: SkyDropdownTriggerDirective,
  })
  public set triggerButton(value: SkyDropdownTriggerDirective | undefined) {
    this.#_triggerButton = value;
    this.#addEventListeners();
    this.#updateTrigger();
  }

  public get triggerButton(): SkyDropdownTriggerDirective | undefined {
    return this.#_customTriggerButton ?? this.#_triggerButton;
  }

  @ContentChild(SkyDropdownTriggerDirective)
  public set customTriggerButton(
    value: SkyDropdownTriggerDirective | undefined,
  ) {
    this.#_customTriggerButton = value;
    this.#addEventListeners();
    this.#updateTrigger();
  }

  protected screenReaderLabelContextMenuId = this.#idSvc.generateId();

  #affixer: SkyAffixer | undefined;
  #ngUnsubscribe = new Subject<void>();
  #triggerUnsubscribe = new Subject<void>();
  #overlay: SkyOverlayInstance | undefined;
  #positionTimeout: number | undefined;

  #_buttonStyle = DEFAULT_BUTTON_STYLE;
  #_buttonType = DEFAULT_BUTTON_TYPE;
  #_customTriggerButton: SkyDropdownTriggerDirective | undefined;
  #_disabled: boolean | undefined = false;
  #_horizontalAlignment = DEFAULT_HORIZONTAL_ALIGNMENT;
  #_isOpen = false;
  #_label: string | undefined;
  #_menuAriaRole: string | undefined;
  #_menuId: string | undefined;
  #_title: string | undefined;
  #_trigger = DEFAULT_TRIGGER_TYPE;
  #_triggerButton: SkyDropdownTriggerDirective | undefined;

  public ngOnInit(): void {
    this.messageStream
      ?.pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message: SkyDropdownMessage) => {
        this.#handleIncomingMessages(message);
      });

    // Load proper icons on theme change.
    this.#themeSvc?.settingsChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#destroyAffixer();
    this.#destroyOverlay();
    clearTimeout(this.#positionTimeout);

    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#triggerUnsubscribe.next();
    this.#triggerUnsubscribe.complete();
  }

  #updateTrigger(): void {
    const triggerButton = this.triggerButton;

    if (triggerButton) {
      triggerButton.buttonType.set(this.buttonType);
      triggerButton.disabled.set(this.disabled);
      triggerButton.isOpen.set(this.isOpen);
      triggerButton.label.set(this.label);
      triggerButton.menuAriaRole.set(this.menuAriaRole);
      triggerButton.menuId.set(this.menuId);
      triggerButton.title.set(this.title);
      triggerButton.disabled.set(this.disabled);
      triggerButton.screenReaderLabelContextMenuId.set(
        this.screenReaderLabelContextMenuId,
      );
    }
  }

  #addEventListeners(): void {
    this.#triggerUnsubscribe.next();
    this.#triggerUnsubscribe.complete();

    this.#triggerUnsubscribe = new Subject<void>();
    const triggerButton = this.triggerButton;

    if (triggerButton) {
      triggerButton.triggerClick
        .pipe(takeUntil(this.#triggerUnsubscribe))
        .subscribe(() => {
          if (this.isOpen) {
            this.#sendMessage(SkyDropdownMessageType.Close);
          } else {
            this.#sendMessage(SkyDropdownMessageType.Open);
            // Wait for dropdown to open, then set focus on first item.
            setTimeout(() => {
              this.#sendMessage(SkyDropdownMessageType.FocusFirstItem);
            });
          }
        });

      triggerButton.triggerKeyDown
        .pipe(takeUntil(this.#triggerUnsubscribe))
        .subscribe((event) => {
          const key = event.key.toLowerCase();

          switch (key) {
            case 'escape':
              /*istanbul ignore else*/
              this.#handleTriggerEscape(event);
              break;

            case 'tab':
              this.#handleTriggerTab();
              break;

            case 'arrowup':
            case 'up':
              this.#handleTriggerUp(event);
              break;

            case 'enter':
            case 'arrowdown':
            case 'down':
            case ' ': // Spacebar.
              this.#handleTriggerDown(event);
              break;
          }
        });

      triggerButton.triggerMouseEnter
        .pipe(takeUntil(this.#triggerUnsubscribe))
        .subscribe(() => {
          this.isMouseEnter = true;
          if (this.trigger === 'hover') {
            this.#sendMessage(SkyDropdownMessageType.Open);
          }
        });

      triggerButton.triggerMouseLeave
        .pipe(takeUntil(this.#triggerUnsubscribe))
        .subscribe(() => {
          this.isMouseEnter = false;
          if (this.trigger === 'hover') {
            // Allow the dropdown menu to set isMouseEnter before checking if the close action
            // should be taken.
            setTimeout(() => {
              if (!this.isMouseEnter) {
                this.#sendMessage(SkyDropdownMessageType.Close);
              }
            });
          }
        });
    }
  }

  #handleTriggerEscape(event: KeyboardEvent): void {
    if (this.isOpen) {
      this.#sendMessage(SkyDropdownMessageType.Close);
      this.#sendMessage(SkyDropdownMessageType.FocusTriggerButton);
      event.stopPropagation();
    }
  }

  #handleTriggerTab(): void {
    if (this.isOpen) {
      this.#sendMessage(SkyDropdownMessageType.Close);
    }
  }

  #handleTriggerUp(event: KeyboardEvent): void {
    if (!this.isOpen) {
      this.#sendMessage(SkyDropdownMessageType.Open);
      this.#sendMessage(SkyDropdownMessageType.FocusLastItem);
      event.preventDefault();
      event.stopPropagation();
    }
  }

  #handleTriggerDown(event: KeyboardEvent): void {
    /*istanbul ignore else*/
    if (!this.isOpen) {
      this.#sendMessage(SkyDropdownMessageType.Open);
      this.#sendMessage(SkyDropdownMessageType.FocusFirstItem);
      event.preventDefault();
      event.stopPropagation();
    }
  }

  #createOverlay(): void {
    /* istanbul ignore next */
    if (this.#overlay) {
      return;
    }

    this.isVisible = false;

    if (this.menuContainerTemplateRef) {
      const overlay = this.#overlayService.create({
        enableScroll: true,
        enablePointerEvents: true,
        environmentInjector: this.#environmentInjector,
      });

      if (this.#zIndex) {
        this.#zIndex
          .pipe(takeUntil(this.#ngUnsubscribe))
          .subscribe((zIndex) => {
            overlay.componentRef.instance.zIndex = zIndex.toString(10);
          });
      }

      overlay.attachTemplate(this.menuContainerTemplateRef);

      overlay.backdropClick
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#sendMessage(SkyDropdownMessageType.Close);
        });

      this.#overlay = overlay;
    }

    this.#changeDetector.markForCheck();
  }

  #destroyAffixer(): void {
    /*istanbul ignore else*/
    if (this.#affixer) {
      this.#affixer.destroy();
      this.#affixer = undefined;
    }
  }

  #destroyOverlay(): void {
    /*istanbul ignore else*/
    if (this.#overlay) {
      this.#overlayService.close(this.#overlay);
      this.#overlay = undefined;
    }
  }

  #createAffixer(menuContainerElementRef: ElementRef): void {
    const affixer = (this.#affixer = this.#affixService.createAffixer(
      menuContainerElementRef,
    ));

    affixer.placementChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((change) => {
        this.isVisible = change.placement !== null;
        this.#changeDetector.markForCheck();
      });

    affixer.affixTo(this.triggerButton?.nativeElement, {
      autoFitContext: SkyAffixAutoFitContext.Viewport,
      enableAutoFit: true,
      horizontalAlignment: parseAffixHorizontalAlignment(
        this.horizontalAlignment,
      ),
      isSticky: true,
      placement: 'below',
    });

    this.isVisible = true;

    this.#changeDetector.markForCheck();
  }

  #handleIncomingMessages(message: SkyDropdownMessage): void {
    if (!this.disabled) {
      switch (message.type) {
        case SkyDropdownMessageType.Open:
          if (!this.isOpen) {
            this.isOpen = true;
            this.#createOverlay();
          }
          break;

        case SkyDropdownMessageType.Close:
          this.isOpen = false;
          this.#destroyOverlay();
          break;

        case SkyDropdownMessageType.Reposition:
          // Only reposition the dropdown if it is already open.
          /* istanbul ignore else */
          if (this.isOpen && this.#affixer) {
            this.#affixer.reaffix();
          }
          break;

        case SkyDropdownMessageType.FocusTriggerButton:
          this.triggerButton?.nativeElement.focus();
          break;
      }
    }
  }

  #sendMessage(type: SkyDropdownMessageType): void {
    this.messageStream?.next({ type });
  }
}
