import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
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
  SkyContentInfo,
  SkyContentInfoProvider,
  SkyOverlayInstance,
  SkyOverlayService,
} from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

import { Observable, Subject, fromEvent as observableFromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { parseAffixHorizontalAlignment } from './dropdown-extensions';
import { SkyDropdownButtonType } from './types/dropdown-button-type';
import { SkyDropdownHorizontalAlignment } from './types/dropdown-horizontal-alignment';
import { SkyDropdownMessage } from './types/dropdown-message';
import { SkyDropdownMessageType } from './types/dropdown-message-type';
import { SkyDropdownTriggerType } from './types/dropdown-trigger-type';

const DEFAULT_BUTTON_STYLE = 'default';
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
})
export class SkyDropdownComponent implements OnInit, OnDestroy {
  /**
   * The background color for the dropdown button. Available values are `default`,
   * `primary`, and `link`. These values set the background color and hover behavior from the
   * [secondary and primary button classes](https://developer.blackbaud.com/skyux/components/button) respectively.
   * @default "default"
   */
  @Input()
  public set buttonStyle(value: string | undefined) {
    this.#_buttonStyle = value ?? DEFAULT_BUTTON_STYLE;
  }

  public get buttonStyle(): string {
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
  public disabled: boolean | undefined = false;

  /**
   * The ARIA label for the dropdown. This sets the dropdown's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility). If multiple dropdowns with no label or the same label appear on the same page,
   * they must have unique ARIA labels that provide context, such as "Context menu for Robert Hernandez" or "Edit Robert Hernandez."
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public label: string | undefined;

  protected contentInfoObs: Observable<SkyContentInfo> | undefined;

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
  public title: string | undefined;

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
      this.#changeDetector.markForCheck();
    }
  }

  public isMouseEnter = false;

  public isVisible = false;

  public menuId: string | undefined;

  public menuAriaRole: string | undefined;

  @ViewChild('menuContainerTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public menuContainerTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('triggerButton', {
    read: ElementRef,
    static: true,
  })
  public set triggerButton(value: ElementRef | undefined) {
    this.#_triggerButton = value;
    this.#addEventListeners();
  }

  public get triggerButton(): ElementRef | undefined {
    return this.#_triggerButton;
  }

  protected destroyRef = inject(DestroyRef);

  #affixer: SkyAffixer | undefined;
  #overlay: SkyOverlayInstance | undefined;
  #ngUnsubscribe = new Subject<void>();
  #positionTimeout: number | undefined;

  readonly #affixService = inject(SkyAffixService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #overlayService = inject(SkyOverlayService);
  readonly #themeSvc = inject(SkyThemeService, { optional: true });
  readonly #zIndex = inject(SKY_STACKING_CONTEXT, { optional: true })?.zIndex;
  readonly #contentInfoProvider = inject(SkyContentInfoProvider, {
    optional: true,
  });

  #_buttonStyle = DEFAULT_BUTTON_STYLE;
  #_buttonType = DEFAULT_BUTTON_TYPE;
  #_horizontalAlignment = DEFAULT_HORIZONTAL_ALIGNMENT;
  #_isOpen = false;
  #_trigger = DEFAULT_TRIGGER_TYPE;
  #_triggerButton: ElementRef | undefined;

  constructor() {
    this.contentInfoObs = this.#contentInfoProvider?.getInfo();
  }

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
  }

  #addEventListeners(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#ngUnsubscribe = new Subject<void>();
    const buttonElement = this.triggerButton?.nativeElement;
    if (buttonElement) {
      observableFromEvent(buttonElement, 'click')
        .pipe(takeUntil(this.#ngUnsubscribe))
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

      observableFromEvent<KeyboardEvent>(buttonElement, 'keydown')
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((event) => {
          const key = event.key.toLowerCase();

          switch (key) {
            case 'escape':
              /*istanbul ignore else*/
              if (this.isOpen) {
                this.#sendMessage(SkyDropdownMessageType.Close);
                this.#sendMessage(SkyDropdownMessageType.FocusTriggerButton);
                event.stopPropagation();
              }
              break;

            case 'tab':
              if (this.isOpen) {
                this.#sendMessage(SkyDropdownMessageType.Close);
              }
              break;

            case 'arrowup':
            case 'up':
              if (!this.isOpen) {
                this.#sendMessage(SkyDropdownMessageType.Open);
                this.#sendMessage(SkyDropdownMessageType.FocusLastItem);
                event.preventDefault();
                event.stopPropagation();
              }
              break;

            case 'enter':
            case 'arrowdown':
            case 'down':
            case ' ': // Spacebar.
              /*istanbul ignore else*/
              if (!this.isOpen) {
                this.#sendMessage(SkyDropdownMessageType.Open);
                this.#sendMessage(SkyDropdownMessageType.FocusFirstItem);
                event.preventDefault();
                event.stopPropagation();
              }
              break;
          }
        });

      observableFromEvent(buttonElement, 'mouseenter')
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.isMouseEnter = true;
          if (this.trigger === 'hover') {
            this.#sendMessage(SkyDropdownMessageType.Open);
          }
        });

      observableFromEvent(buttonElement, 'mouseleave')
        .pipe(takeUntil(this.#ngUnsubscribe))
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

  #createOverlay(): void {
    if (this.#overlay) {
      return;
    }

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
    const affixer = this.#affixService.createAffixer(menuContainerElementRef);

    affixer.placementChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((change) => {
        this.isVisible = change.placement !== null;
        this.#changeDetector.markForCheck();
      });

    this.#affixer = affixer;
  }

  #handleIncomingMessages(message: SkyDropdownMessage): void {
    if (!this.disabled) {
      switch (message.type) {
        case SkyDropdownMessageType.Open:
          this.isOpen = true;
          this.#positionDropdownMenu();
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

  #positionDropdownMenu(): void {
    this.isVisible = false;
    this.#createOverlay();
    this.#changeDetector.markForCheck();

    // Explicitly declare the `setTimeout` from the `window` object in order to use the DOM typings
    // during a unit test (instead of confusing this with Node's `setTimeout`).
    this.#positionTimeout = window.setTimeout(() => {
      if (this.#affixer) {
        this.#affixer.affixTo(this.triggerButton?.nativeElement, {
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
    });
  }
}
