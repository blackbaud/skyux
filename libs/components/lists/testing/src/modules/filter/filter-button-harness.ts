import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFilterButtonHarnessFilters } from './filter-button-harness-filters';

/**
 * Harness for interacting with a back to top component in tests.
 */
export class SkyFilterButtonHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-filter-button';

  #getFilterButton = this.locatorFor('button.sky-filter-btn');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFilterButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFilterButtonHarnessFilters,
  ): HarnessPredicate<SkyFilterButtonHarness> {
    return this.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the filter button.
   */
  public async clickFilterButton(): Promise<void> {
    return await (await this.#getFilterButton()).click();
  }

  /**
   * Gets the filter button's aria-controls attribute.
   */
  public async getAriaControls(): Promise<string | null> {
    return await (await this.#getFilterButton()).getAttribute('aria-controls');
  }

  /**
   * Gets the filter button's aria-expanded attribute.
   */
  public async getAriaExpanded(): Promise<boolean> {
    const expanded = await (
      await this.#getFilterButton()
    ).getAttribute('aria-expanded');

    return !!expanded && expanded === 'true';
  }

  /**
   * Gets the filter button's aria-label.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getFilterButton()).getAttribute('aria-label');
  }

  /**
   * Whether the filter button is active.
   */
  public async isActive(): Promise<boolean> {
    return await (
      await this.#getFilterButton()
    ).hasClass('sky-filter-btn-active');
  }

  /**
   * Whether the filter button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = await (
      await this.#getFilterButton()
    ).getAttribute('disabled');
    return disabled !== null;
  }
}
