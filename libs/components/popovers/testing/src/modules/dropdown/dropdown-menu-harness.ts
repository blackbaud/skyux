import { HarnessPredicate } from '@angular/cdk/testing';
import {
  SkyOverlayHarness,
  SkyQueryableComponentHarness,
} from '@skyux/core/testing';

import { SkyDropdownItemHarness } from './dropdown-item-harness';
import { SkyDropdownItemHarnessFilters } from './dropdown-item-harness.filters';
import { SkyDropdownMenuHarnessFilters } from './dropdown-menu-harness.filters';

/**
 * Harness for interacting with a dropdown menu component in tests.
 */
export class SkyDropdownMenuHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-dropdown-menu';

  #getOverlay =
    this.documentRootLocatorFactory().locatorForOptional(SkyOverlayHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDropdownMenuHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDropdownMenuHarnessFilters,
  ): HarnessPredicate<SkyDropdownMenuHarness> {
    return new HarnessPredicate(SkyDropdownMenuHarness, filters);
  }

  /**
   * Clicks out of the dropdown menu.
   */
  public async clickOut(): Promise<void> {
    await (await (await this.#getOverlay())?.host())?.click();
  }

  /**
   * Gets the `aria-labelledby` value.
   */
  public async getAriaLabelledBy(): Promise<string | null> {
    return await (await this.host()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the dropdown menu role.
   */
  public async getAriaRole(): Promise<string | null> {
    return await (await this.host()).getAttribute('role');
  }

  /**
   * Gets a specific dropdown menu item that meets certain criteria.
   */
  public async getItem(
    filter: SkyDropdownItemHarnessFilters,
  ): Promise<SkyDropdownItemHarness> {
    return await this.locatorFor(SkyDropdownItemHarness.with(filter))();
  }

  /**
   * Gets an array of dropdown menu items.
   */
  public async getItems(
    filters?: SkyDropdownItemHarnessFilters,
  ): Promise<SkyDropdownItemHarness[]> {
    const harnesses = await this.locatorForAll(
      SkyDropdownItemHarness.with(filters || {}),
    )();

    if (harnesses.length === 0) {
      if (filters) {
        throw new Error(
          `Unable to find dropdown menu item(s) with filter(s): ${JSON.stringify(
            filters,
          )}.`,
        );
      } else {
        throw new Error(
          'Unable to retrieve item(s) because dropdown menu is empty.',
        );
      }
    }

    return harnesses;
  }
}
