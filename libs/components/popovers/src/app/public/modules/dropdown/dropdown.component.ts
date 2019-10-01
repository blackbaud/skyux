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

  @Input()
  public alignment: SkyPopoverAlignment = 'left';

  @Input()
  public set buttonStyle(value: string) {
    this._buttonStyle = value;
  }

  public get buttonStyle(): string {
    return this._buttonStyle || 'default';
  }

  @Input()
  public set buttonType(value: string) {
    this._buttonType = value;
  }

  public get buttonType(): string {
    return this._buttonType || 'select';
  }

  @Input()
  public disabled = false;

  @Input()
  public dismissOnBlur = true;

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

  @Input()
  public messageStream = new Subject<SkyDropdownMessage>();

  @Input()
  public title: string;

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
