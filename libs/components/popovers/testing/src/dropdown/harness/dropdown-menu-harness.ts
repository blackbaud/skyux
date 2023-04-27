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
  public async getItems(): Promise<TestElement[]> {
    return await this.#getDropdownItems();
  }

  /**
   * Gets the dropdown menu item at a specific index
   */
  public async getItemAtIndex(index: number): Promise<TestElement | undefined> {
    const itemsList = await this.getItems();

    if (itemsList?.length === 0) {
      throw new Error('Unable to retrieve item because dropdown menu is empty');
    }

    return itemsList.at(index);
  }
}
