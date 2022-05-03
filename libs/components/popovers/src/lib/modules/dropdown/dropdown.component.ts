import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  SkyAffixAutoFitContext,
  SkyAffixService,
  SkyAffixer,
  SkyOverlayInstance,
  SkyOverlayService,
} from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

import { Subject, fromEvent as observableFromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { parseAffixHorizontalAlignment } from './dropdown-extensions';
import { SkyDropdownHorizontalAlignment } from './types/dropdown-horizontal-alignment';
import { SkyDropdownMessage } from './types/dropdown-message';
import { SkyDropdownMessageType } from './types/dropdown-message-type';
import { SkyDropdownTriggerType } from './types/dropdown-trigger-type';

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
   * Specifies a background color for the dropdown button. Available values are `default` and
   * `primary`. These values set the background color from the
   * [secondary and primary button classes](https://developer.blackbaud.com/skyux/components/button) respectively.
   * @default "default"
   */
  @Input()
  public set buttonStyle(value: string | undefined) {
    this._buttonStyle = value;
  }

  public get buttonStyle(): string {
    return this._buttonStyle || 'default';
  }

  /**
   * Specifies the type of button to render as the dropdown's trigger element. To display a button
   * with text and a caret, specify `select` and then enter the button text in a
   * `sky-dropdown-button` element. To display a round button with an ellipsis, specify
   * `context-menu`. And to display a button with a [Font Awesome icon](http://fontawesome.io/icons/), specify the icon's class name.
   * For example, to display the `fa-filter` icon, specify `filter`.
   * @default "select"
   */
  @Input()
  public set buttonType(value: string | undefined) {
    this._buttonType = value;
  }

  public get buttonType(): string {
    return this._buttonType || 'select';
  }

  /**
   * Indicates whether to disable the dropdown button.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this._disabled = value;
  }

  public get disabled(): boolean {
    return this._disabled || false;
  }

  /**
   * Indicates whether to close the dropdown when users click away from the menu.
   * @default true
   */
  @Input()
  public set dismissOnBlur(value: boolean) {
    this._dismissOnBlur = value;
  }

  public get dismissOnBlur(): boolean {
    if (this._dismissOnBlur === undefined) {
      return true;
    }

    return this._dismissOnBlur;
  }

  /**
   * Specifies an ARIA label for the dropdown. This sets the dropdown's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   */
  @Input()
  public label: string | undefined;

  /**
   * Specifies the horizontal alignment of the dropdown menu in relation to the dropdown button.
   * @default "left"
   */
  @Input()
  public set horizontalAlignment(
    value: SkyDropdownHorizontalAlignment | undefined
  ) {
    this._horizontalAlignment = value;
  }

  public get horizontalAlignment(): SkyDropdownHorizontalAlignment {
    return this._horizontalAlignment || 'left';
  }

  /**
   * Provides an observable to send commands to the dropdown. The commands should respect
   * the [[SkyDropdownMessage]] type.
   */

  @Input()
  public messageStream = new Subject<SkyDropdownMessage>();

  /**
   * Specifies a title to display in a tooltip when users hover the mouse over the dropdown button.
   */
  @Input()
  public title: string | undefined;

  /**
   * Specifies how users interact with the dropdown button to expose the dropdown menu.
   * We recommend the default `click` value because the `hover` value can pose
   * [accessibility](https://developer.blackbaud.com/skyux/learn/accessibility) issues
   * for users on touch devices such as phones and tablets.
   * @deprecated We recommend against using this property. If you choose to use the deprecated
   * `hover` value anyway, we recommend that you not use it in combination with the `title`
   * property. (This property will be removed in the next major version release.)
   * @default "click"
   */
  @Input()
  public set trigger(value: SkyDropdownTriggerType | undefined) {
    this._trigger = value;
  }

  public get trigger(): SkyDropdownTriggerType {
    return this._trigger || 'click';
  }

  public set isOpen(value: boolean) {
    this._isOpen = value;
    this.changeDetector.markForCheck();
  }

  public get isOpen(): boolean {
    return this._isOpen || false;
  }

  @ViewChild('menuContainerElementRef', {
    read: ElementRef,
  })
  public set menuContainerElementRef(value: ElementRef | undefined) {
    if (value) {
      this._menuContainerElementRef = value;
      this.destroyAffixer();
      this.createAffixer(value);
      this.changeDetector.markForCheck();
    }
  }

  public get menuContainerElementRef(): ElementRef | undefined {
    return this._menuContainerElementRef;
  }

  public isMouseEnter = false;

  public isVisible = false;

  public menuId: string | undefined;

  public menuAriaRole: string | undefined;

  @ViewChild('menuContainerTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  private menuContainerTemplateRef!: TemplateRef<unknown>;

  @ViewChild('triggerButton', {
    read: ElementRef,
    static: true,
  })
  private triggerButton!: ElementRef;

  private affixer: SkyAffixer | undefined;

  private ngUnsubscribe = new Subject();

  private overlay: SkyOverlayInstance | undefined;

  private _buttonStyle: string | undefined;

  private _buttonType: string | undefined;

  private _disabled: boolean | undefined;

  private _dismissOnBlur: boolean | undefined;

  private _horizontalAlignment: SkyDropdownHorizontalAlignment | undefined;

  private _isOpen = false;

  private _menuContainerElementRef: ElementRef | undefined;

  private _trigger: SkyDropdownTriggerType | undefined;

  #positionTimeout: number | undefined;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private affixService: SkyAffixService,
    private overlayService: SkyOverlayService,
    @Optional() private themeSvc?: SkyThemeService
  ) {}

  public ngOnInit(): void {
    this.addEventListeners();

    this.messageStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: SkyDropdownMessage) => {
        this.handleIncomingMessages(message);
      });

    // Load proper icons on theme change.
    this.themeSvc?.settingsChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.destroyAffixer();
    this.destroyOverlay();
    clearTimeout(this.#positionTimeout);

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private addEventListeners(): void {
    const buttonElement = this.triggerButton.nativeElement;

    observableFromEvent(buttonElement, 'click')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.isOpen) {
          this.sendMessage(SkyDropdownMessageType.Close);
        } else {
          this.sendMessage(SkyDropdownMessageType.Open);
          // Wait for dropdown to open, then set focus on first item.
          setTimeout(() => {
            this.sendMessage(SkyDropdownMessageType.FocusFirstItem);
          });
        }
      });

    observableFromEvent<KeyboardEvent>(buttonElement, 'keydown')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event) => {
        const key = event.key.toLowerCase();

        /* tslint:disable-next-line:switch-default */
        switch (key) {
          case 'escape':
            /*istanbul ignore else*/
            if (this.isOpen) {
              this.sendMessage(SkyDropdownMessageType.Close);
              this.sendMessage(SkyDropdownMessageType.FocusTriggerButton);
              event.stopPropagation();
            }
            break;

          case 'tab':
            if (this.isOpen && this.dismissOnBlur) {
              this.sendMessage(SkyDropdownMessageType.Close);
            }
            break;

          case 'arrowup':
          case 'up':
            if (!this.isOpen) {
              this.sendMessage(SkyDropdownMessageType.Open);
              this.sendMessage(SkyDropdownMessageType.FocusLastItem);
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
              this.sendMessage(SkyDropdownMessageType.Open);
              this.sendMessage(SkyDropdownMessageType.FocusFirstItem);
              event.preventDefault();
              event.stopPropagation();
            }
            break;
        }
      });

    observableFromEvent(buttonElement, 'mouseenter')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.isMouseEnter = true;
        if (this.trigger === 'hover') {
          this.sendMessage(SkyDropdownMessageType.Open);
        }
      });

    observableFromEvent(buttonElement, 'mouseleave')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.isMouseEnter = false;
        if (this.trigger === 'hover') {
          // Allow the dropdown menu to set isMouseEnter before checking if the close action
          // should be taken.
          setTimeout(() => {
            if (!this.isMouseEnter) {
              this.sendMessage(SkyDropdownMessageType.Close);
            }
          });
        }
      });
  }

  private createOverlay(): void {
    if (this.overlay) {
      return;
    }

    const overlay = this.overlayService.create({
      enableScroll: true,
      enablePointerEvents: true,
    });

    overlay.attachTemplate(this.menuContainerTemplateRef);

    overlay.backdropClick.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.dismissOnBlur) {
        this.sendMessage(SkyDropdownMessageType.Close);
      }
    });

    this.overlay = overlay;
  }

  private destroyAffixer(): void {
    /*istanbul ignore else*/
    if (this.affixer) {
      this.affixer.destroy();
      this.affixer = undefined;
    }
  }

  private destroyOverlay(): void {
    /*istanbul ignore else*/
    if (this.overlay) {
      this.overlayService.close(this.overlay);
      this.overlay = undefined;
    }
  }

  private createAffixer(menuContainerElementRef: ElementRef): void {
    const affixer = this.affixService.createAffixer(menuContainerElementRef);

    affixer.placementChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((change) => {
        this.isVisible = change.placement !== null;
        this.changeDetector.markForCheck();
      });

    this.affixer = affixer;
  }

  private handleIncomingMessages(message: SkyDropdownMessage): void {
    if (!this.disabled) {
      /* tslint:disable-next-line:switch-default */
      switch (message.type) {
        case SkyDropdownMessageType.Open:
          this.isOpen = true;
          this.positionDropdownMenu();
          break;

        case SkyDropdownMessageType.Close:
          this.isOpen = false;
          this.destroyOverlay();
          break;

        case SkyDropdownMessageType.Reposition:
          // Only reposition the dropdown if it is already open.
          /* istanbul ignore else */
          if (this.isOpen && this.affixer) {
            this.affixer.reaffix();
          }
          break;

        case SkyDropdownMessageType.FocusTriggerButton:
          this.triggerButton.nativeElement.focus();
          break;
      }
    }
  }

  private sendMessage(type: SkyDropdownMessageType): void {
    this.messageStream.next({ type });
  }

  private positionDropdownMenu(): void {
    this.isVisible = false;
    this.createOverlay();
    this.changeDetector.markForCheck();

    // Explicitly declare the `setTimeout` from the `window` object in order to use the DOM typings
    // during a unit test (instead of confusing this with Node's `setTimeout`).
    this.#positionTimeout = window.setTimeout(() => {
      this.affixer!.affixTo(this.triggerButton.nativeElement, {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: true,
        horizontalAlignment: parseAffixHorizontalAlignment(
          this.horizontalAlignment
        ),
        isSticky: true,
        placement: 'below',
      });

      this.isVisible = true;
      this.changeDetector.markForCheck();
    });
  }
}
