import { DebugElement } from '@angular/core';

import { ComponentFixture } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkySortFixtureMenu } from './sort-fixture-menu';

import { SkySortFixtureMenuItem } from './sort-fixture-menu-item';

/**
 * Provides information for and interaction with a SKY UX sort component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkySortFixture {
  /**
   * The active sort menu item, if one exists. Menu items are only available when the menu dropdown
   * is open. If the menu dropdown is closed, this property will be undefined.
   */
  public get activeMenuItem(): SkySortFixtureMenuItem {
    return this.menuItems?.find((x) => x.isActive);
  }

  /**
   * The sort menu's properties.
   */
  public get menu(): SkySortFixtureMenu {
    return {
      buttonText: SkyAppTestUtility.getText(this.getSortButtonTextEl()),
      isOpen: this.getDropdownMenuEl() !== null,
    };
  }

  /**
   * The properties of each sort menu item. Menu items are only available when the menu dropdown
   * is open. If the menu dropdown is closed, this property will be undefined.
   */
  public get menuItems(): SkySortFixtureMenuItem[] {
    // Return undefined when we can't determine what the options are.
    // We do this to avoid any confusion with an empty set of options.
    if (!this.menu.isOpen) {
      return;
    }

    return this.getSortItems().map((item: HTMLElement, i: number) => {
      const itemButton = item.querySelector('button');

      return {
        index: i,
        isActive: item.classList.contains('sky-sort-item-selected'),
        text: SkyAppTestUtility.getText(itemButton),
      };
    });
  }

  private _debugEl: DebugElement;

  constructor(private fixture: ComponentFixture<any>, skyTestId: string) {
    this._debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-sort'
    );
  }

  /**
   * Closes the sort dropdown menu if it isn't closed already.
   */
  public async closeMenu(): Promise<void> {
    // if the menu is already closed, do nothing
    if (!this.menu.isOpen) {
      return;
    }

    const menu = this.getDropdownButtonEl();
    if (menu !== undefined && !menu.disabled) {
      menu.click();

      this.fixture.detectChanges();
      await this.fixture.whenStable();

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }
  }

  /**
   * Opens the sort dropdown menu if it isn't open already.
   */
  public async openMenu(): Promise<void> {
    // if the menu is already open, do nothing
    if (this.menu.isOpen) {
      return;
    }

    const menu = this.getDropdownButtonEl();

    if (menu !== undefined && !menu.disabled) {
      menu.click();

      this.fixture.detectChanges();
      await this.fixture.whenStable();

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }
  }

  /**
   * Ensures the sort menu is open and selects the menu item with the specified index, if it exists.
   * @param menuItemIndex The index of the menu item to select.
   */
  public async selectMenuItemByIndex(menuItemIndex: number): Promise<void> {
    return this.selectMenuItem((_item: HTMLElement, index: number) => {
      return index === menuItemIndex;
    });
  }

  /**
   * Ensures the sort menu is open and selects the menu item with the specified text,
   * if a matching item is available.
   * @param menuItemText The text of the menu item to select.
   */
  public async selectMenuItemByText(menuItemText: string): Promise<void> {
    return this.selectMenuItem((item: HTMLElement) => {
      return SkyAppTestUtility.getText(item) === menuItemText;
    });
  }

  //#region helpers

  private getDropdownButtonEl(): HTMLButtonElement {
    return this._debugEl.query(By.css('.sky-dropdown-button'))
      ?.nativeElement as HTMLButtonElement;
  }

  private getDropdownMenuEl(): HTMLElement {
    return document.querySelector('sky-overlay .sky-dropdown-menu');
  }

  private getSortButtonTextEl(): HTMLElement {
    return this._debugEl.query(By.css('.sky-sort-btn-text'))
      ?.nativeElement as HTMLElement;
  }

  private getSortItems(): HTMLElement[] {
    const resultNodes = document.querySelectorAll('sky-overlay .sky-sort-item');
    return Array.prototype.slice.call(resultNodes);
  }

  /**
   * Ensures the sort menu is open and selects the menu item via a selection predicate,
   * if a matching item is available.
   * @param selectionPredicate The menu item selector method to use.
   */
  private async selectMenuItem(
    selectionPredicate: (item: HTMLElement, index: number) => boolean
  ): Promise<void> {
    // make sure the sort menu is open
    if (!this.menu.isOpen) {
      await this.openMenu();
    }

    // find the requested menu item using the selectionPredicate parameter
    const items = this.getSortItems();
    const targetItem = items.find((item: HTMLElement, index: number) =>
      selectionPredicate(item, index)
    );

    // if we found the item, select it
    if (targetItem) {
      // we've got the '.sky-sort-item' div, but we want to click it's child button element
      const targetButton = targetItem.querySelector('button');
      targetButton.click();

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }
  }

  //#endregion
}
