import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownItemHarness } from './dropdown-item-harness';
import { SkyDropdownMenuHarnessFilters } from './dropdown-menu-harness.filters';

/**
 * Harness for interacting with dropdown menu in tests.
 */
export class SkyDropdownMenuHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-dropdown-menu';

  #getDropdownItems = this.locatorForAll(SkyDropdownItemHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDropdownMenuHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDropdownMenuHarnessFilters
  ): HarnessPredicate<SkyDropdownMenuHarness> {
    return SkyDropdownMenuHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the `aria-labelledby` value.
   */
  public async getAriaLabelledBy(): Promise<string | null> {
    return (await this.host()).getAttribute('aria-labelledby');
  }

  /**
   * Clicks the dropdown menu item at index.
   * @param index Index of dropdown menu item.
   */
  public async clickItemByIndex(index: number): Promise<void> {
    await (await this.getItemByIndex(index))?.click();
  }

  /**
   * Clicks the dropdown menu item with a specific role.
   * @param role Role of dropdown menu item to be clicked.
   */
  public async clickItemWithRole(role: string): Promise<void> {
    const menuItem = await this.#getItemWithRole(role);
    if (!menuItem) {
      throw new Error(
        `Unable to click item. Item with role ${role} does not exist in this dropdown menu`
      );
    }
    await (await this.#getItemWithRole(role))?.click();
  }

  /**
   * Gets the dropdown menu item at a specific index.
   * @param index Index of dropdown menu item to be clicked.
   */
  public async getItemByIndex(
    index: number
  ): Promise<SkyDropdownItemHarness | undefined> {
    const itemsList = await this.getItems();

    if (itemsList?.length === 0) {
      throw new Error(
        'Unable to retrieve item because dropdown menu is empty.'
      );
    }

    return itemsList.at(index);
  }

  /**
   * Gets the role of dropdown menu at index.
   * @param index Index of dropdown menu item.
   */
  public async getItemRoleByIndex(
    index: number
  ): Promise<string | null | undefined> {
    return (await this.getItemByIndex(index))?.getAriaRole();
  }

  /**
   * Gets an array of dropdown menu items.
   */
  public async getItems(): Promise<SkyDropdownItemHarness[]> {
    return await this.#getDropdownItems();
  }

  /**
   * Gets the dropdown menu role.
   */
  public async getAriaRole(): Promise<string | null> {
    return (await this.host()).getAttribute('role');
  }

  /**
   * Gets the dropdown menu item from role.
   * @param role Role of dropdown menu item.
   */
  async #getItemWithRole(
    role: string
  ): Promise<SkyDropdownItemHarness | undefined> {
    const itemsList = await this.getItems();

    if (itemsList?.length === 0) {
      throw new Error(
        'Unable to retrieve item because dropdown menu is empty.'
      );
    }

    for (const item of itemsList) {
      if ((await item.getAriaRole())?.match(role)) {
        return item;
      }
    }

    return undefined;
  }
}
