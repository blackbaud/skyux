import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFilterItemHarnessFilters } from './filter-item-harness-filters';

/**
 * Harness to interact with a filter item component in tests.
 */
export class SkyFilterItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-filter-item-base';

  #getButton = this.locatorFor('button.sky-filter-bar-btn');
  #getFilterName = this.locatorFor('span.sky-filter-item-name');
  #getFilterValue = this.locatorForOptional('span.sky-filter-item-value');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFilterBarItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFilterItemHarnessFilters,
  ): HarnessPredicate<SkyFilterItemHarness> {
    return SkyFilterItemHarness.getDataSkyIdPredicate(filters)
      .addOption('filterId', filters.filterId, async (harness, filterId) => {
        const harnessId = await (
          await harness.#getButton()
        ).getAttribute('data-filter-id');
        return await HarnessPredicate.stringMatches(harnessId, filterId);
      })
      .addOption('labelText', filters.labelText, async (harness, labelText) => {
        const harnessName = await harness.getLabelText();
        return await HarnessPredicate.stringMatches(harnessName, labelText);
      });
  }

  /**
   * Clicks the filter item to open its modal.
   */
  public async click(): Promise<void> {
    return await (await this.#getButton()).click();
  }

  /**
   * Gets the filter item value.
   */
  public async getFilterValue(): Promise<string | undefined> {
    return await (await this.#getFilterValue())?.text();
  }

  /**
   * Gets the filter item label.
   */
  public async getLabelText(): Promise<string> {
    return await (await this.#getFilterName()).text();
  }
}
