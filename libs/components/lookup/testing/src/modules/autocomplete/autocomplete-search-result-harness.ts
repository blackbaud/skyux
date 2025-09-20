import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyAutocompleteSearchResultHarnessFilters } from './autocomplete-search-result-harness-filters';

/**
 * Harness for interacting with an autocomplete search result in tests.
 */
export class SkyAutocompleteSearchResultHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-autocomplete-result';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyAutocompleteSearchResultHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyAutocompleteSearchResultHarnessFilters,
  ): HarnessPredicate<SkyAutocompleteSearchResultHarness> {
    return new HarnessPredicate(
      SkyAutocompleteSearchResultHarness,
      filters,
    ).addOption(
      'textContent',
      filters.text,
      async (harness, text) =>
        await HarnessPredicate.stringMatches(await harness.getText(), text),
    );
  }

  /**
   * Returns the value of the search result's descriptor property.
   * This value is set by the autocomplete's `descriptorProperty` input.
   */
  public async getDescriptorValue(): Promise<string> {
    return (await (
      await this.host()
    ).getAttribute('data-descriptor-value')) as string;
  }

  /**
   * Selects the search result.
   */
  public async select(): Promise<void> {
    await (await this.host()).click();
  }

  /**
   * Returns the text of the search result.
   */
  public async getText(): Promise<string> {
    return await (await this.host()).text();
  }
}
