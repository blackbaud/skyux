import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
} from '@angular/cdk/testing';

import { SkyAutocompleteSearchResultHarnessFilters } from './autocomplete-search-result-harness-filters';

/**
 * Harness for interacting with an autocomplete search results in tests.
 * @internal
 */
export class SkyAutocompleteSearchResultHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-autocomplete-result';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyAutocompleteSearchResultHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyAutocompleteSearchResultHarnessFilters
  ): HarnessPredicate<SkyAutocompleteSearchResultHarness> {
    return new HarnessPredicate(
      SkyAutocompleteSearchResultHarness,
      filters
    ).addOption('textContent', filters.text, async (harness, text) =>
      HarnessPredicate.stringMatches(await harness.getText(), text)
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
   * Returns a child harness.
   */
  public async queryHarness<T extends ComponentHarness>(
    query: HarnessQuery<T>
  ): Promise<T | null> {
    return this.locatorForOptional(query)();
  }

  /**
   * Selects the search result.
   */
  public async select(): Promise<void> {
    return (await this.host()).click();
  }

  /**
   * Returns the text of the search result.
   */
  public async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
