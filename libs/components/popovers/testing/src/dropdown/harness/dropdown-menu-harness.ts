import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownItemHarness } from './dropdown-item-harness';
import { SkyDropdownMenuHarnessFilters } from './dropdown-menu-harness.filters';

/**
 * Harness for interacting with dropdown menu in tests
 */
export class SkyDropdownMenuHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-dropdown-menu';

  #getDropdownItems = this.locatorForAll(SkyDropdownItemHarness);

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
   * Gets the aria-labelledby value
   */
  public async getAriaLabelledBy(): Promise<string | null> {
    return (await this.host()).getAttribute('aria-labelledby');
  }

  /**
   * Clicks the dropdown menu item at index
   * @param index Index of dropdown menu item
   */
  public async clickItemAtIndex(index: number): Promise<void> {
    await (await this.getItemAtIndex(index))?.click();
  }

  /**
   * Clicks the dropdown menu item with a specific role
   * @param role Role of dropdown menu item to be clicked
   */
  public async clickItemWithRole(role: string): Promise<void> {
    const menuItem = await this.getItemWithRole(role);
    if (!menuItem) {
      throw new Error(
        `Unable to click item. Item with role ${role} does not exist in this dropdown menu`
      );
    }
    await (await this.getItemWithRole(role))?.click();
  }

  /**
   * Gets the dropdown menu item at a specific index
   * @param index Index of dropdown menu item to be clicked
   */
  public async getItemAtIndex(
    index: number
  ): Promise<SkyDropdownItemHarness | undefined> {
    const itemsList = await this.getItems();

    if (itemsList?.length === 0) {
      throw new Error('Unable to retrieve item because dropdown menu is empty');
    }

    return itemsList.at(index);
  }

  /**
   * Gets the role of dropdown menu at index
   * @param index Index of dropdown menu item
   */
  public async getItemRoleAtIndex(
    index: number
  ): Promise<string | null | undefined> {
    return (await this.getItemAtIndex(index))?.getRole();
  }

  /**
   * Gets an array of dropdown menu items
   */
  public async getItems(): Promise<SkyDropdownItemHarness[]> {
    return await this.#getDropdownItems();
  }

  /**
   * Gets the dropdown menu item from role
   * @param role Role of dropdown menu item
   */
  private async getItemWithRole(
    role: string
  ): Promise<SkyDropdownItemHarness | undefined> {
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
   * Gets the dropdown menu role
   */
  public async getRole(): Promise<string | null> {
    return (await this.host()).getAttribute('role');
  }
}
