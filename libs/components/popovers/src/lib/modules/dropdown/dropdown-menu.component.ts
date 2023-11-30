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
  ViewEncapsulation,
} from '@angular/core';

import { Subject, fromEvent as observableFromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDropdownItemComponent } from './dropdown-item.component';
import { SkyDropdownComponent } from './dropdown.component';
import { SkyDropdownMenuChange } from './types/dropdown-menu-change';
import { SkyDropdownMessage } from './types/dropdown-message';
import { SkyDropdownMessageType } from './types/dropdown-message-type';

let nextId = 0;
/**
 * Creates a menu that contains dropdown menu items.
 *
 */
@Component({
  selector: 'sky-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SkyDropdownMenuComponent implements AfterContentInit, OnDestroy {
  /**
   * The HTML element ID of the element that labels
   * the dropdown menu. This sets the dropdown menu's `aria-labelledby` attribute to provide a text equivalent for
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   */
  @Input()
  public ariaLabelledBy: string | undefined;

  /**
   * The ARIA role for the dropdown menu
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the dropdown menu functions and what it controls. The dropdown button
   * inherits this value to set its `aria-haspopup` property. For information
   * about how an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/#roles).
   * @default "menu"
   */
  @Input()
  public set ariaRole(value: string | undefined) {
    this.#_ariaRole = value ?? 'menu';
  }

  public get ariaRole(): string {
    return this.#_ariaRole;
  }

  /**
   * Whether to use the browser's native focus function when users navigate through menu
   * items with the keyboard. To disable the native focus function, set this property to `false`.
   * For example, to let users interact with the dropdown menu but keep the keyboard focus on a
   * different element, set this property to `false`.
   * @default true
   * @internal
   */
  @Input()
  public set useNativeFocus(value: boolean | undefined) {
    this.#_useNativeFocus = value ?? true;
  }

  public get useNativeFocus(): boolean {
    return this.#_useNativeFocus;
  }

  /**
   * Fires when the dropdown menu's active index or selected item changes. This event provides an
   * observable to emit changes, and the response is of
   * the SkyDropdownMenuChange type.
   * @internal
   */
  @Output()
  public menuChanges = new EventEmitter<SkyDropdownMenuChange>();

  public dropdownMenuId = `sky-dropdown-menu-${++nextId}`;

  public set menuIndex(value: number) {
    if (value < 0) {
      value = this.menuItems.length - 1;
    }

    if (value >= this.menuItems.length) {
      value = 0;
    }

    this.#_menuIndex = value;
  }

  public get menuIndex(): number {
    return this.#_menuIndex;
  }

  @ContentChildren(SkyDropdownItemComponent, { descendants: true })
  public menuItems!: QueryList<SkyDropdownItemComponent>;

  #ngUnsubscribe = new Subject<void>();

  #_ariaRole = 'menu';

  #_menuIndex = 0;

  #_useNativeFocus = true;

  #changeDetector: ChangeDetectorRef;
  #elementRef: ElementRef;
  #dropdownComponent: SkyDropdownComponent | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    @Optional() dropdownComponent?: SkyDropdownComponent
  ) {
    this.#changeDetector = changeDetector;
    this.#elementRef = elementRef;
    this.#dropdownComponent = dropdownComponent;
  }

  public ngAfterContentInit(): void {
    /* istanbul ignore else */
    if (this.#dropdownComponent) {
      this.#dropdownComponent.menuId = this.dropdownMenuId;
      this.#dropdownComponent.menuAriaRole = this.ariaRole;

      this.#dropdownComponent.messageStream
        ?.pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((message: SkyDropdownMessage) => {
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
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((change: SkyDropdownMenuChange) => {
          // Close the dropdown when a menu item is selected.
          if (change.selectedItem) {
            this.#sendMessage(SkyDropdownMessageType.Close);
            this.#sendMessage(SkyDropdownMessageType.FocusTriggerButton);
          }

          if (change.items) {
            // Update the popover style and position whenever the number of items changes.
            this.#sendMessage(SkyDropdownMessageType.Reposition);
          }
        });
    }

    // Reset dropdown whenever the menu items change.
    this.menuItems.changes
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((items: QueryList<SkyDropdownItemComponent>) => {
        this.reset();
        this.menuChanges.emit({
          items: items.toArray(),
        });
      });

    this.#addEventListeners();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public focusFirstItem(): void {
    if (!this.#hasFocusableItems()) {
      return;
    }

    this.menuIndex = 0;

    const firstItem = this.#getItemByIndex(this.menuIndex);
    if (firstItem && firstItem.isFocusable()) {
      this.#focusItem(firstItem);
    } else {
      this.focusNextItem();
    }
  }

  public focusLastItem(): void {
    if (!this.#hasFocusableItems()) {
      return;
    }

    this.menuIndex = this.menuItems.length - 1;

    const lastItem = this.#getItemByIndex(this.menuIndex);
    if (lastItem && lastItem.isFocusable()) {
      this.#focusItem(lastItem);
    } else {
      this.focusPreviousItem();
    }
  }

  public focusPreviousItem(): void {
    if (!this.#hasFocusableItems()) {
      return;
    }

    this.menuIndex--;

    const previousItem = this.#getItemByIndex(this.menuIndex);
    if (previousItem && previousItem.isFocusable()) {
      this.#focusItem(previousItem);
    } else {
      this.focusPreviousItem();
    }
  }

  public focusNextItem() {
    if (!this.#hasFocusableItems()) {
      return;
    }

    this.menuIndex++;

    const nextItem = this.#getItemByIndex(this.menuIndex);
    if (nextItem && nextItem.isFocusable()) {
      this.#focusItem(nextItem);
    } else {
      this.focusNextItem();
    }
  }

  public reset(): void {
    this.#_menuIndex = -1;
    this.#resetItemsActiveState();
    this.#changeDetector.markForCheck();
  }

  #resetItemsActiveState() {
    this.menuItems.forEach((item: SkyDropdownItemComponent) => {
      item.resetState();
    });
  }

  #focusItem(item: SkyDropdownItemComponent): void {
    this.#resetItemsActiveState();
    item.focusElement(this.useNativeFocus);
    this.menuChanges.emit({
      activeIndex: this.menuIndex,
    });
  }

  #getItemByIndex(index: number): SkyDropdownItemComponent | undefined {
    return this.menuItems.find((_, i) => i === index);
  }

  #selectItemByEventTarget(target: EventTarget): void {
    const selectedItem = this.menuItems.find(
      (item: SkyDropdownItemComponent, i: number) => {
        const found = item.elementRef.nativeElement.contains(target);

        if (found) {
          this.menuIndex = i;
          this.menuChanges.next({
            activeIndex: this.menuIndex,
          });
        }

        return found;
      }
    );

    /* istanbul ignore else */
    if (selectedItem) {
      this.menuChanges.next({
        selectedItem,
      });
    }
  }

  #sendMessage(type: SkyDropdownMessageType): void {
    this.#dropdownComponent?.messageStream?.next({ type });
  }

  #addEventListeners(): void {
    const dropdownMenuElement = this.#elementRef.nativeElement;

    observableFromEvent<MouseEvent>(dropdownMenuElement, 'click')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((event) => {
        this.#selectItemByEventTarget(event.target as EventTarget);
      });

    observableFromEvent<KeyboardEvent>(dropdownMenuElement, 'keydown')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((event) => {
        const key = event.key.toLowerCase();

        switch (key) {
          case 'escape':
            this.#sendMessage(SkyDropdownMessageType.Close);
            this.#sendMessage(SkyDropdownMessageType.FocusTriggerButton);
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
            if (this.#dropdownComponent?.dismissOnBlur) {
              this.#sendMessage(SkyDropdownMessageType.Close);
            }
            this.#sendMessage(SkyDropdownMessageType.FocusTriggerButton);
            break;
        }
      });

    observableFromEvent(dropdownMenuElement, 'mouseenter')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        /* istanbul ignore else */
        if (this.#dropdownComponent) {
          this.#dropdownComponent.isMouseEnter = true;
        }
      });

    observableFromEvent(dropdownMenuElement, 'mouseleave')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        /* istanbul ignore else */
        if (this.#dropdownComponent) {
          this.#dropdownComponent.isMouseEnter = false;
          // Allow the dropdown component to set isMouseEnter before checking if the close action
          // should be taken.
          setTimeout(() => {
            if (
              this.#dropdownComponent &&
              this.#dropdownComponent.trigger === 'hover' &&
              this.#dropdownComponent.isMouseEnter === false
            ) {
              this.#sendMessage(SkyDropdownMessageType.Close);
            }
          });
        }
      });
  }

  #hasFocusableItems(): boolean {
    const found = this.menuItems.find((item) => item.isFocusable());
    return found !== undefined;
  }
}
