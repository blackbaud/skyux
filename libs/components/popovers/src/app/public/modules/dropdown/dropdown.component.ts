import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import 'rxjs/add/operator/takeUntil';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyPopoverAlignment,
  SkyPopoverComponent,
  SkyPopoverTrigger
} from '../popover';

import {
  SkyDropdownAdapterService
} from './dropdown-adapter.service';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType,
  SkyDropdownTriggerType
} from './types';

@Component({
  selector: 'sky-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDropdownAdapterService]
})
export class SkyDropdownComponent implements OnInit, OnDestroy {

  /**
   * Specifies the horizontal alignment of the dropdown menu in relation to the dropdown button.
   * Available values are `left`, `right`, and `center`.
   * @default "left"
   */
  @Input()
  public alignment: SkyPopoverAlignment = 'left';

  /**
   * Specifies a background color for the dropdown button. Available values are `default` and
   * `primary`. These values set the background color from the
   * [secondary and primary button classes](https://developer.blackbaud.com/skyux/components/button) respectively.
   * @default "default"
   */
  @Input()
  public set buttonStyle(value: string) {
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
  public set buttonType(value: string) {
    this._buttonType = value;
  }

  public get buttonType(): string {
    return this._buttonType || 'select';
  }

  /**
   * Indicates whether to disable the dropdown button.
   */
  @Input()
  public disabled = false;

  /**
   * Indicates whether to close the dropdown when users click away from the menu.
   */
  @Input()
  public dismissOnBlur = true;

  /**
   * Specifies an accessibility label to provide a text equivalent for screen readers when the
   * dropdown button has no text.
   */
  @Input()
  public set label(value: string) {
    this._label = value;
  }

  public get label(): string {
    if (this.buttonType === 'select' || this.buttonType === 'tab') {
      return this._label;
    }
    return this._label || this.getString('skyux_dropdown_context_menu_default_label');
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
  public title: string;

  /**
   * Specifies how users interact with the dropdown button to expose the dropdown menu. The
   * available values are `click` and `hover`. We recommend the default `click` value because the
   * `hover` value can pose accessibility issues for users on touch devices such as phones and tablets.
   * @deprecated We recommend against using this property. If you choose to use the deprecated `hover` value
   * anyway, we recommend that you not use it in combination with the `title` property.
   * @default "click"
   */
  @Input()
  public set trigger(value: SkyDropdownTriggerType) {
    this._trigger = value;
  }

  public get trigger(): SkyDropdownTriggerType {
    return this._trigger || 'click';
  }

  /**
   * @internal
   * Indicates if the dropdown button element or any of its children have focus.
   */
  public get buttonIsFocused(): boolean {
    return this.adapter.elementHasFocus(this.triggerButton);
  }

  public get isOpen(): boolean {
    return this._isOpen;
  }

  public menuId: string;

  /**
   * @internal
   * Indicates if the dropdown button menu or any of its children have focus.
   */
  public get menuIsFocused(): boolean {
    return this.adapter.elementHasFocus(this.popover.popoverContainer);
  }

  @ViewChild('triggerButton')
  private triggerButton: ElementRef;

  @ViewChild(SkyPopoverComponent)
  private popover: SkyPopoverComponent;

  private isKeyboardActive = false;

  private ngUnsubscribe = new Subject();

  private _buttonStyle: string;

  private _buttonType: string;

  private _isOpen = false;

  private _label: string;

  private _trigger: SkyDropdownTriggerType;

  constructor(
    private windowRef: SkyWindowRefService,
    private resourcesService: SkyLibResourcesService,
    private adapter: SkyDropdownAdapterService
  ) { }

  public ngOnInit(): void {
    this.messageStream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((message: SkyDropdownMessage) => {
        this.handleIncomingMessages(message);
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    if (this._isOpen) {
      /* tslint:disable-next-line:switch-default */
      switch (key) {
        // After an item is selected with the enter key,
        // wait a moment before returning focus to the dropdown trigger element.
        case 'enter':
          this.windowRef.getWindow().setTimeout(() => {
            this.sendMessage(SkyDropdownMessageType.FocusTriggerButton);
          });
          break;

        // Allow the menu to be opened with the arrowdown key
        // if it is first opened with the mouse.
        case 'down':
        case 'arrowdown':
          if (!this.isKeyboardActive) {
            this.isKeyboardActive = true;
            this.sendMessage(SkyDropdownMessageType.FocusFirstItem);
            event.preventDefault();
          }
          break;
      }

      return;
    }

    /* tslint:disable-next-line:switch-default */
    switch (key) {
      case 'enter':
        this.isKeyboardActive = true;
        break;

      case 'down':
      case 'arrowdown':
        this.isKeyboardActive = true;
        this.sendMessage(SkyDropdownMessageType.Open);
        event.preventDefault();
        break;
    }
  }

  public onPopoverOpened(): void {
    this._isOpen = true;
    // Focus the first item if the menu was opened with the keyboard.
    if (this.isKeyboardActive) {
      this.sendMessage(SkyDropdownMessageType.FocusFirstItem);
    }
  }

  public onPopoverClosed(): void {
    this._isOpen = false;
    this.isKeyboardActive = false;
  }

  public getPopoverTriggerType(): SkyPopoverTrigger {
    // Map the dropdown trigger type to the popover trigger type.
    return (this.trigger === 'click') ? 'click' : 'mouseenter';
  }

  private handleIncomingMessages(message: SkyDropdownMessage): void {
    if (!this.disabled) {
      /* tslint:disable-next-line:switch-default */
      switch (message.type) {
        case SkyDropdownMessageType.Open:
          this.positionPopover();
          break;

        case SkyDropdownMessageType.Close:
          this.popover.close();
          break;

        case SkyDropdownMessageType.Reposition:
          // Only reposition the dropdown if it is already open.
          if (this._isOpen) {
            this.windowRef.getWindow().setTimeout(() => {
              this.popover.reposition();
            });
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

  private positionPopover(): void {
    this.popover.positionNextTo(
      this.triggerButton,
      'below',
      this.alignment
    );
  }

  private getString(key: string): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.resourcesService.getStringForLocale(
      { locale: 'en-US' },
      key
    );
  }
}
