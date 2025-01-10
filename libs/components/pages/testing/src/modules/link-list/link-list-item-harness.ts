import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyLinkListItemHarnessFilters } from './link-list-item-harness-filters';

/**
 * Harness for interacting with a linked list item in tests.
 */
export class SkyLinkListItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector =
    'a.sky-link-list-item, button.sky-link-list-item';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyLinkListItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyLinkListItemHarnessFilters,
  ): HarnessPredicate<SkyLinkListItemHarness> {
    return SkyLinkListItemHarness.getDataSkyIdPredicate(filters).addOption(
      'text',
      filters.text,
      async (harness, text) => {
        const itemText = await harness.getText();
        return await HarnessPredicate.stringMatches(itemText, text);
      },
    );
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
