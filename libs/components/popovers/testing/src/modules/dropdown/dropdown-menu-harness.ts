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
   * Gets a specific dropdown menu item based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getItem(
    filter: SkyDropdownItemHarnessFilters,
  ): Promise<SkyDropdownItemHarness> {
    return await this.locatorFor(SkyDropdownItemHarness.with(filter))();
  }

  /**
   * Gets an array of dropdown menu items based on the filter criteria.
   * If no filter is provided, returns all dropdown menu items.
   * @param filters The optional filter criteria.
   */
  public async getItems(
    filters?: SkyDropdownItemHarnessFilters,
  ): Promise<SkyDropdownItemHarness[]> {
    return await this.locatorForAll(
      SkyDropdownItemHarness.with(filters || {}),
    )();
  }
}
