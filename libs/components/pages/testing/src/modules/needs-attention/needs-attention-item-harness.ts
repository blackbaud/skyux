import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyNeedsAttentionItemHarnessFilters } from './needs-attention-item-harness-filters';

/**
 * Harness for interacting with a needs attention item in tests.
 */
export class SkyNeedsAttentionItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector =
    'li.sky-needs-attention-item-wrapper > a.sky-needs-attention-item, li.sky-needs-attention-item-wrapper > button.sky-needs-attention-item';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyNeedsAttentionItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyNeedsAttentionItemHarnessFilters,
  ): HarnessPredicate<SkyNeedsAttentionItemHarness> {
    return SkyNeedsAttentionItemHarness.getDataSkyIdPredicate(
      filters,
    ).addOption('text', filters.text, async (harness, text) => {
      const itemText = await harness.getText();
      return await HarnessPredicate.stringMatches(itemText, text);
    });
  }

  /**
   * Gets the text content of the item.
   */
  public async getText(): Promise<string> {
    return await (await this.host()).text();
  }

  /**
   * Clicks the item.
   */
  public async click(): Promise<void> {
    return await (await this.host()).click();
  }
}
