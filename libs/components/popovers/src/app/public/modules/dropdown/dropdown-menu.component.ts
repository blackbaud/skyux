import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';

import {
  fromEvent as observableFromEvent,
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyDropdownComponent
} from './dropdown.component';

import {
  SkyDropdownItemComponent
} from './dropdown-item.component';

import {
  SkyDropdownMenuChange
} from './types/dropdown-menu-change';

import {
  SkyDropdownMessage
} from './types/dropdown-message';

import {
  SkyDropdownMessageType
} from './types/dropdown-message-type';

let nextId = 0;

@Component({
  selector: 'sky-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SkyDropdownMenuComponent implements AfterContentInit, OnDestroy {

  /**
   * Sets the dropdown menu's `aria-labelledby` attribute to support accessibility. The value should
   * be the HTML element ID (without the leading `#`) of the element that labels the dropdown menu.
   */
  @Input()
  public ariaLabelledBy: string;

  /**
   * Specifies an ARIA role for the dropdown menu to support accessibility by indicating how the
   * dropdown menu functions and what it controls. The ARIA role indicates what the dropdown menu
   * represents on the web page. The dropdown button inherits this value to set its `aria-haspopup`
   * property. For information about ARIA roles, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/roles).
   * @default "menu"
   */
  @Input()
  public set ariaRole(value: string) {
    this._ariaRole = value;
  }

  public get ariaRole(): string {
    return this._ariaRole || 'menu';
  }

  /**
   * Indicates whether to use the browser's native focus function when users navigate through menu
   * items with the keyboard. To disable the native focus function, set this property to `false`.
   * For example, to let users interact with the dropdown menu but keep the keyboard focus on a
   * different element, set this property to `false`.
   * @default true
   */
  @Input()
  public set useNativeFocus(value: boolean) {
    this._useNativeFocus = value;
  }

  public get useNativeFocus(): boolean {
    if (this._useNativeFocus === undefined) {
      return true;
    }

    return this._useNativeFocus;
  }

  /**
   * Fires when the dropdown menu's active index or selected item changes. This event provides an
   * observable to emit changes, and the response is of
   * the SkyDropdownMenuChange type.
   */
  @Output()
  public menuChanges = new EventEmitter<SkyDropdownMenuChange>();

  public dropdownMenuId: string = `sky-dropdown-menu-${++nextId}`;

  private get hasFocusableItems(): boolean {
    const found = this.menuItems.find(item => item.isFocusable());
    return (found !== undefined);
  }

  public set menuIndex(value: number) {
    if (value < 0) {
      value = this.menuItems.length - 1;
    }

    if (value >= this.menuItems.length) {
      value = 0;
    }

    this._menuIndex = value;
  }

  public get menuIndex(): number {
    return this._menuIndex;
  }

  @ContentChildren(SkyDropdownItemComponent)
  public menuItems: QueryList<SkyDropdownItemComponent>;

  private ngUnsubscribe = new Subject();

  private _ariaRole: string;

  private _menuIndex = 0;

  private _useNativeFocus: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    @Optional() private dropdownComponent: SkyDropdownComponent
  ) { }

  public ngAfterContentInit(): void {
    /* istanbul ignore else */
    if (this.dropdownComponent) {
      this.dropdownComponent.menuId = this.dropdownMenuId;
      this.dropdownComponent.menuAriaRole = this.ariaRole;

      this.dropdownComponent.messageStream
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe((message: SkyDropdownMessage) => {
          /* tslint:disable-next-line:switch-default */
          switch (message.type) {
            case SkyDropdownMessageType.Open:
            case SkyDropdownMessageType.Close:
            this.reset();
            break;

            case SkyDropdownMessageType.FocusFirstItem:
            this.focusFirstItem();
            break;

            case SkyDropdownMessageType.FocusNextItem:
            this.focusNextItem();
            break;

            case SkyDropdownMessageType.FocusPreviousItem:
            this.focusPreviousItem();
            break;

            case SkyDropdownMessageType.FocusLastItem:
            this.focusLastItem();
            break;
          }
        });

      this.menuChanges
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe((change: SkyDropdownMenuChange) => {
          // Close the dropdown when a menu item is selected.
          if (change.selectedItem) {
            this.sendMessage(SkyDropdownMessageType.Close);
            this.sendMessage(SkyDropdownMessageType.FocusTriggerButton);
          }

          if (change.items) {
            // Update the popover style and position whenever the number of items changes.
            this.sendMessage(SkyDropdownMessageType.Reposition);
          }
        });
    }

    // Reset dropdown whenever the menu items change.
    this.menuItems.changes
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((items: QueryList<SkyDropdownItemComponent>) => {
        this.reset();
        this.menuChanges.emit({
          items: items.toArray()
        });
      });

    this.addEventListeners();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe = undefined;
  }

  public focusFirstItem(): void {
    if (!this.hasFocusableItems) {
      return;
    }

    this.menuIndex = 0;

    const firstItem = this.getItemByIndex(this.menuIndex);
    if (firstItem && firstItem.isFocusable()) {
      this.focusItem(firstItem);
    } else {
      this.focusNextItem();
    }
  }

  public focusLastItem(): void {
    if (!this.hasFocusableItems) {
      return;
    }

    this.menuIndex = this.menuItems.length - 1;

    const lastItem = this.getItemByIndex(this.menuIndex);
    if (lastItem && lastItem.isFocusable()) {
      this.focusItem(lastItem);
    } else {
      this.focusPreviousItem();
    }
  }

  public focusPreviousItem(): void {
    if (!this.hasFocusableItems) {
      return;
    }

    this.menuIndex--;

    const previousItem = this.getItemByIndex(this.menuIndex);
    if (previousItem && previousItem.isFocusable()) {
      this.focusItem(previousItem);
    } else {
      this.focusPreviousItem();
    }
  }

  public focusNextItem() {
    if (!this.hasFocusableItems) {
      return;
    }

    this.menuIndex++;

    const nextItem = this.getItemByIndex(this.menuIndex);
    if (nextItem && nextItem.isFocusable()) {
      this.focusItem(nextItem);
    } else {
      this.focusNextItem();
    }
  }

  public reset(): void {
    this._menuIndex = -1;
    this.resetItemsActiveState();
    this.changeDetector.markForCheck();
  }

  private resetItemsActiveState() {
    this.menuItems.forEach((item: SkyDropdownItemComponent) => {
      item.resetState();
    });
  }

  private focusItem(item: SkyDropdownItemComponent): void {
    this.resetItemsActiveState();
    item.focusElement(this.useNativeFocus);
    this.menuChanges.emit({
      activeIndex: this.menuIndex
    });
  }

  private getItemByIndex(index: number): SkyDropdownItemComponent {
    return this.menuItems.find((item: any, i: number) => {
      return (i === index);
    });
  }

  private selectItemByEventTarget(target: EventTarget): void {
    const selectedItem = this.menuItems.find((item: SkyDropdownItemComponent, i: number) => {
      const found = (item.elementRef.nativeElement.contains(target));

      if (found) {
        this.menuIndex = i;
        this.menuChanges.next({
          activeIndex: this.menuIndex
        });
      }

      return found;
    });

    /* istanbul ignore else */
    if (selectedItem) {
      this.menuChanges.next({
        selectedItem
      });
    }
  }

  private sendMessage(type: SkyDropdownMessageType): void {
    this.dropdownComponent.messageStream.next({ type });
  }

  private addEventListeners(): void {
    const dropdownMenuElement = this.elementRef.nativeElement;

    observableFromEvent(dropdownMenuElement, 'click')
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((event: MouseEvent) => {
        this.selectItemByEventTarget(event.target);
      });

    observableFromEvent(dropdownMenuElement, 'keydown')
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((event: KeyboardEvent) => {
        const key = event.key.toLowerCase();

        /*tslint:disable-next-line:switch-default*/
        switch (key) {
          case 'escape':
            this.sendMessage(SkyDropdownMessageType.Close);
            this.sendMessage(SkyDropdownMessageType.FocusTriggerButton);
            event.stopPropagation();
            event.preventDefault();
            break;

          case 'arrowdown':
          case 'down':
            this.focusNextItem();
            event.preventDefault();
            break;

          case 'arrowup':
          case 'up':
            this.focusPreviousItem();
            event.preventDefault();
            break;

          case 'tab':
            if (this.dropdownComponent.dismissOnBlur) {
              this.sendMessage(SkyDropdownMessageType.Close);
            }
            this.sendMessage(SkyDropdownMessageType.FocusTriggerButton);
            break;
        }
      });

    observableFromEvent(dropdownMenuElement, 'mouseenter')
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.dropdownComponent.isMouseEnter = true;
      });

    observableFromEvent(dropdownMenuElement, 'mouseleave')
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.dropdownComponent.isMouseEnter = false;
        // Allow the dropdown component to set isMouseEnter before checking if the close action
        // should be taken.
        setTimeout(() => {
          if (
            this.dropdownComponent.trigger === 'hover' &&
            this.dropdownComponent.isMouseEnter === false
          ) {
            this.sendMessage(SkyDropdownMessageType.Close);
          }
        });
      });
  }

}
