import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownMenuHarnessFilters } from './dropdown-menu-harness.filters';
import { SkyDropdownMenuItemHarness } from './dropdown-menu-item-harness';

/**
 * Harness for interacting with dropdown menu in tests
 */
export class SkyDropdownMenuHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-dropdown-menu';

  #getDropdownItems = this.locatorForAll(SkyDropdownMenuItemHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDropdownMenuHarness` that meets certain criteria
   */
  public static with(
    filters: SkyDropdownMenuHarnessFilters
  ): HarnessPredicate<SkyDropdownMenuHarness> {
    return SkyDropdownMenuHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets an array of dropdown menu items
   */
  public async getItems(): Promise<SkyDropdownMenuItemHarness[]> {
    return await this.#getDropdownItems();
  }

  /**
   * Gets the dropdown menu item at a specific index
   */
  public async getItemAtIndex(
    index: number
  ): Promise<SkyDropdownMenuItemHarness | undefined> {
    const itemsList = await this.getItems();

    if (itemsList?.length === 0) {
      throw new Error('Unable to retrieve item because dropdown menu is empty');
    }

    return itemsList.at(index);
  }

  /**
   * Gets the dropdown menu item from role
   */
  private async getItemWithRole(
    role: string
  ): Promise<SkyDropdownMenuItemHarness | undefined> {
    const itemsList = await this.getItems();

    if (itemsList?.length === 0) {
      throw new Error('Unable to retrieve item because dropdown menu is empty');
    }

    for (const item of itemsList) {
      if ((await item.getRole())?.match(role)) return item;
    }

    return undefined;
  }

  /**
   * Gets the aria-labelledby value
   */
  public async getAriaLabelledBy(): Promise<string | null> {
    return (await this.host()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the dropdown menu role
   */
  public async getRole(): Promise<string | null> {
    return (await this.host()).getAttribute('role');
  }

  /**
   * Clicks the dropdown menu item at index
   * @param index Index of dropdown menu item
   */
  public async clickMenuItemAtIndex(index: number): Promise<void> {
    await (await this.getItemAtIndex(index))?.click();
  }

  /**
   * Gets the role of dropdown menu at index
   * @param index Index of dropdown menu item
   */
  public async getMenuItemRoleAtIndex(
    index: number
  ): Promise<string | null | undefined> {
    return (await this.getItemAtIndex(index))?.getRole();
  }

  /**
   * Clicks the dropdown menu item with role
   * @param role Role of dropdown menu item to be clicked
   */
  public async clickMenuItemWithRole(role: string): Promise<void> {
    const menuItem = await this.getItemWithRole(role);
    if (!menuItem) {
      throw new Error(
        `Unable to click item. Item with role ${role} does not exist in this dropdown menu`
      );
    }
    await (await this.getItemWithRole(role))?.click();
  }
}
