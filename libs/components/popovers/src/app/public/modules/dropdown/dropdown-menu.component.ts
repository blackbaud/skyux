import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList
} from '@angular/core';

import 'rxjs/add/operator/takeUntil';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyDropdownComponent
} from './dropdown.component';

import {
  SkyDropdownItemComponent
} from './dropdown-item.component';

import {
  SkyDropdownMenuChange,
  SkyDropdownMessage,
  SkyDropdownMessageType
} from './types';

let nextId = 0;

@Component({
  selector: 'sky-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
   * represents on the web page. For information about ARIA roles, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/roles).
   */
  @Input()
  public ariaRole = 'menu';

  /**
   * Indicates whether to use the browser's native focus function when users navigate through menu
   * items with the keyboard. To disable the native focus function, set this property to `false`.
   * For example, to let users interact with the dropdown menu but keep the keyboard focus on a
   * different element, set this property to `false`.
   */
  @Input()
  public useNativeFocus = true;

  /**
   * Fires when the dropdown menu's active index or selected item changes. This event provides an
   * observable to emit changes, and the response is of
   * the [[SkyDropdownMessage]] type.
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

  private _menuIndex = 0;

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Optional() private dropdownComponent: SkyDropdownComponent
  ) { }

  public ngAfterContentInit(): void {
    /* istanbul ignore else */
    if (this.dropdownComponent) {
      this.dropdownComponent.menuId = this.dropdownMenuId;
      this.dropdownComponent.messageStream
        .takeUntil(this.ngUnsubscribe)
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
          }
        });

      this.menuChanges
        .takeUntil(this.ngUnsubscribe)
        .subscribe((change: SkyDropdownMenuChange) => {
          // Close the dropdown when a menu item is selected.
          if (change.selectedItem) {
            this.dropdownComponent.messageStream.next({
              type: SkyDropdownMessageType.Close
            });
          }

          if (change.items) {
            // Update the popover style and position whenever the number of
            // items changes.
            this.dropdownComponent.messageStream.next({
              type: SkyDropdownMessageType.Reposition
            });
          }
        });
    }

    // Reset dropdown whenever the menu items change.
    this.menuItems.changes
      .takeUntil(this.ngUnsubscribe)
      .subscribe((items: QueryList<SkyDropdownItemComponent>) => {
        this.reset();
        this.menuChanges.emit({
          items: items.toArray()
        });
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    const selectedItem = this.menuItems
      .find((item: SkyDropdownItemComponent, i: number) => {
        const found = (item.elementRef.nativeElement.contains(event.target));

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

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    if (key === 'arrowdown' || key === 'down') {
      this.focusNextItem();
      event.preventDefault();
    }

    if (key === 'arrowup' || key === 'up') {
      this.focusPreviousItem();
      event.preventDefault();
    }
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
}
