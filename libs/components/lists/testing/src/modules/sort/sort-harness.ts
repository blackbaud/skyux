import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  SkyDropdownHarness,
  SkyDropdownMenuHarness,
} from '@skyux/popovers/testing';

import { SkySortHarnessFilters } from './sort-harness-filters';
import { SkySortItemHarness } from './sort-item-harness';
import { SkySortItemHarnessFilters } from './sort-item-harness-filters';

/**
 * Harness for interacting with a sort component in tests.
 */
export class SkySortHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-sort';

  #getDropdown = this.locatorFor(SkyDropdownHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySortHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySortHarnessFilters,
  ): HarnessPredicate<SkySortHarness> {
    return SkySortHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the sort component.
   */
  public async click(): Promise<void> {
    await (await this.#getDropdown()).clickDropdownButton();
  }

  /**
   * Gets the aria-label value.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getDropdown()).getAriaLabel();
  }

  /**
   * Gets the text that appears on the sort button.
   */
  public async getButtonText(): Promise<string> {
    const text = await (
      await this.locatorForOptional('.sky-sort-btn-text')()
    )?.text();

    return text ?? '';
  }

  /**
   * Gets a harness for a specific sort item that meets certain criteria.
   */
  public async getItem(
    filters: SkySortItemHarnessFilters,
  ): Promise<SkySortItemHarness> {
    const menuHarness = await this.#getMenuHarness();

    return await menuHarness.queryHarness(SkySortItemHarness.with(filters));
  }

  /**
   * Gets an array of sort items.
   */
  public async getItems(
    filters?: SkySortItemHarnessFilters,
  ): Promise<SkySortItemHarness[]> {
    const menuHarness = await this.#getMenuHarness();

    const items = await menuHarness.queryHarnesses(
      SkySortItemHarness.with(filters || {}),
    );

    if (filters && !items.length) {
      throw new Error(
        `Unable to find any sort items with filter(s): ${JSON.stringify(filters)}`,
      );
    }

    return items;
  }

  async #getMenuHarness(): Promise<SkyDropdownMenuHarness> {
    try {
      // eslint-disable-next-line no-var
      var menuHarness = await (await this.#getDropdown()).getDropdownMenu();
    } catch {
      throw new Error(
        'Unable to locate any sort items because the sort menu is not open.',
      );
    }

    return menuHarness;
  }
}
