import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownItemHarness } from './dropdown-item-harness';
import { SkyDropdownItemHarnessFilters } from './dropdown-item-harness.filters';
import { SkyDropdownMenuHarnessFilters } from './dropdown-menu-harness.filters';

/**
 * Harness for interacting with dropdown menu in tests.
 */
export class SkyDropdownMenuHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-dropdown-menu';

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
   * Gets an array of dropdown menu item harnesses.
   * @param filters Optional filter for which menu items to return
   */
  public async getAllItems(
    filters?: SkyDropdownItemHarnessFilters
  ): Promise<SkyDropdownItemHarness[]> {
    const harnesses = await this.locatorForAll(
      SkyDropdownItemHarness.with(filters || {})
    )();

    if (filters && harnesses.length === 0) {
      throw new Error(
        `Unable to find dropdown menu item to click with filter(s): ${JSON.stringify(
          filters
        )}`
      );
    }

    return harnesses;
  }

  /**
   * Gets the first item that matches the given filters
   * @param filters filter for which menu item to return
   */
  public async getItem(
    filters: SkyDropdownItemHarnessFilters
  ): Promise<SkyDropdownItemHarness> {
    const harnesses = await this.getAllItems(filters);
    return harnesses[0];
  }

  /**
   * Gets the dropdown menu role.
   */
  public async getAriaRole(): Promise<string | null> {
    return (await this.host()).getAttribute('role');
  }
}
