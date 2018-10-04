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

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import {
  SkyPopoverAlignment,
  SkyPopoverComponent,
  SkyPopoverTrigger
} from '../popover';

import {
  SkyWindowRefService
} from '@skyux/core/modules/window';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType,
  SkyDropdownTriggerType
} from './types';

@Component({
  selector: 'sky-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDropdownComponent implements OnInit, OnDestroy {
  @Input()
  public alignment: SkyPopoverAlignment = 'left';

  @Input()
  public get buttonStyle(): string {
    return this._buttonStyle || 'default';
  }

  public set buttonStyle(value: string) {
    this._buttonStyle = value;
  }

  @Input()
  public set buttonType(value: string) {
    this._buttonType = value;
  }

  public get buttonType(): string {
    return this._buttonType || 'select';
  }

  @Input()
  public get label(): string {
    if (this.buttonType === 'select' || this.buttonType === 'tab') {
      return this._label;
    }
    return this._label || this.getResource('skyux_dropdown_context_menu_default_label');
  }

  public set label(value: string) {
    this._label = value;
  }

  @Input()
  public dismissOnBlur = true;

  @Input()
  public messageStream = new Subject<SkyDropdownMessage>();

  @Input()
  public title: string;

  @Input()
  public disabled = false;

  @Input()
  public set trigger(value: SkyDropdownTriggerType) {
    this._trigger = value;
  }

  public get trigger(): SkyDropdownTriggerType {
    return this._trigger || 'click';
  }

  public get isOpen(): boolean {
    return this._isOpen;
  }

  public menuId: string;

  @ViewChild('triggerButton')
  private triggerButton: ElementRef;

  @ViewChild(SkyPopoverComponent)
  private popover: SkyPopoverComponent;

  private ngUnsubscribe = new Subject();
  private isKeyboardActive = false;

  // TODO: The following require statement is not recommended, but was done
  // to avoid a breaking change (SkyResources is synchronous, but SkyAppResources is asynchronous).
  // We should switch to using SkyAppResources in the next major release.
  private resources: any = require('!json-loader!.skypageslocales/resources_en_US.json');

  private _isOpen = false;
  private _buttonType: string;
  private _buttonStyle: string;
  private _label: string;
  private _trigger: SkyDropdownTriggerType;

  constructor(
    private windowRef: SkyWindowRefService
  ) { }

  public ngOnInit() {
    this.messageStream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((message: SkyDropdownMessage) => {
        this.handleIncomingMessages(message);
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
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

  public onPopoverOpened() {
    this._isOpen = true;
    // Focus the first item if the menu was opened with the keyboard.
    if (this.isKeyboardActive) {
      this.sendMessage(SkyDropdownMessageType.FocusFirstItem);
    }
  }

  public onPopoverClosed() {
    this._isOpen = false;
    this.isKeyboardActive = false;
  }

  public getPopoverTriggerType(): SkyPopoverTrigger {
    // Map the dropdown trigger type to the popover trigger type.
    return (this.trigger === 'click') ? 'click' : 'mouseenter';
  }

  private handleIncomingMessages(message: SkyDropdownMessage) {
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

  private sendMessage(type: SkyDropdownMessageType) {
    this.messageStream.next({ type });
  }

  private positionPopover() {
    this.popover.positionNextTo(
      this.triggerButton,
      'below',
      this.alignment
    );
  }

  /**
   * This method is a stand-in for the old SkyResources service from skyux2.
   * TODO: We should consider using Builder's resources service instead, but it will
   * require a breaking change since the `label` getter is currently synchronous,
   * and Builder's service is asynchronous.
   * @param key
   */
  private getResource(key: string): string {
    return this.resources[key].message;
  }
}
