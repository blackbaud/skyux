import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownMenuHarnessFilters } from './dropdown-menu-harness.filters';

/**
 * Harness for interacting with dropdown menu in tests
 */
export class SkyDropdownMenuHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown-menu';

  #getDropdownMenu = this.locatorFor('.sky-dropdown-menu');
  #getDropdownItems = this.locatorForAll('.sky-dropdown-item');

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
  private async getItems(): Promise<TestElement[]> {
    return await this.#getDropdownItems();
  }

  /**
   * Gets the dropdown menu item at a specific index
   */
  private async getItemAtIndex(
    index: number
  ): Promise<TestElement | undefined> {
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
  ): Promise<TestElement | undefined> {
    const itemsList = await this.getItems();

    if (itemsList?.length === 0) {
      throw new Error('Unable to retrieve item because dropdown menu is empty');
    }

    for (const item of itemsList) {
      if ((await item.getAttribute('role'))?.match(role)) return item;
    }

    return undefined;
  }

  /**
   * Gets the aria-labelledby value
   */
  public async getAriaLabelledBy(): Promise<string | null> {
    return (await this.#getDropdownMenu()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the dropdown menu role
   */
  public async getRole(): Promise<string | null> {
    return (await this.#getDropdownMenu()).getAttribute('role');
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
  public async getMenuItemRole(
    index: number
  ): Promise<string | null | undefined> {
    return (await this.getItemAtIndex(index))?.getAttribute('role');
  }

  /**
   * Clicks the dropdown menu item at index
   * @param index Index of dropdown menu item
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
