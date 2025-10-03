import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyKeyInfoHarness } from '@skyux/indicators/testing';

import { SkyListSummaryItemHarnessFilters } from './list-summary-item-harness-filters';

/**
 * Harness for interacting with a list summary item component in tests.
 */
export class SkyListSummaryItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-list-summary-item';

  #getKeyInfo = this.locatorFor(SkyKeyInfoHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyListSummaryItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyListSummaryItemHarnessFilters,
  ): HarnessPredicate<SkyListSummaryItemHarness> {
    return SkyListSummaryItemHarness.getDataSkyIdPredicate(filters)
      .addOption('labelText', filters.labelText, async (harness, labelText) => {
        const actualLabelText = await harness.getLabelText();
        return await HarnessPredicate.stringMatches(actualLabelText, labelText);
      })
      .addOption('valueText', filters.valueText, async (harness, valueText) => {
        const actualValueText = await harness.getValueText();
        return await HarnessPredicate.stringMatches(actualValueText, valueText);
      });
  }

  /**
   * Gets the current value text.
   */
  public async getValueText(): Promise<string> {
    const keyInfo = await this.#getKeyInfo();
    return await keyInfo.getValueText();
  }

  /**
   * Gets the current label text.
   */
  public async getLabelText(): Promise<string> {
    const keyInfo = await this.#getKeyInfo();
    return await keyInfo.getLabelText();
  }

  /**
   * Gets the key info harness for advanced interactions.
   */
  public async getKeyInfo(): Promise<SkyKeyInfoHarness> {
    return await this.#getKeyInfo();
  }

  /**
   * Clicks the help inline button to show the help popover.
   */
  public async clickHelpInline(): Promise<void> {
    const keyInfo = await this.#getKeyInfo();
    return await keyInfo.clickHelpInline();
  }

  /**
   * Gets the help popover content text.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    const keyInfo = await this.#getKeyInfo();
    return await keyInfo.getHelpPopoverContent();
  }

  /**
   * Gets the help popover title text.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    const keyInfo = await this.#getKeyInfo();
    return await keyInfo.getHelpPopoverTitle();
  }
}
