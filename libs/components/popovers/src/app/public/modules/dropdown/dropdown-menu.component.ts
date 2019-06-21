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

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

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
  public dropdownMenuId: string = `sky-dropdown-menu-${++nextId}`;

  @Input()
  public ariaRole = 'menu';

  @Input()
  public ariaLabelledBy: string;

  @Input()
  public useNativeFocus = true;

  @Output()
  public menuChanges = new EventEmitter<SkyDropdownMenuChange>();

  public get menuIndex(): number {
    return this._menuIndex;
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

  @ContentChildren(SkyDropdownItemComponent)
  public menuItems: QueryList<SkyDropdownItemComponent>;

  private ngUnsubscribe = new Subject();

  private get hasFocusableItems(): boolean {
    const found = this.menuItems.find(item => item.isFocusable());
    return (found !== undefined);
  }

  private _menuIndex = 0;

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Optional() private dropdownComponent: SkyDropdownComponent
  ) { }

  public ngAfterContentInit() {
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

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent) {
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
  public onKeyDown(event: KeyboardEvent) {
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

  public focusFirstItem() {
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

  public focusPreviousItem() {
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

  public reset() {
    this._menuIndex = -1;
    this.resetItemsActiveState();
    this.changeDetector.markForCheck();
  }

  private resetItemsActiveState() {
    this.menuItems.forEach((item: SkyDropdownItemComponent) => {
      item.resetState();
    });
  }

  private focusItem(item: SkyDropdownItemComponent) {
    this.resetItemsActiveState();
    item.focusElement(this.useNativeFocus);
    this.menuChanges.emit({
      activeIndex: this.menuIndex
    });
  }

  private getItemByIndex(index: number) {
    return this.menuItems.find((item: any, i: number) => {
      return (i === index);
    });
  }
}
