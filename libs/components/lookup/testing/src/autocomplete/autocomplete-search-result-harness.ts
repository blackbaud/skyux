import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyAutocompleteSearchResultHarnessFilters } from './autocomplete-search-result-filters';

export class SkyAutocompleteSearchResultHarness extends ComponentHarness {
  public static hostSelector = '.sky-autocomplete-result';

  public static with(
    filters: SkyAutocompleteSearchResultHarnessFilters
  ): HarnessPredicate<SkyAutocompleteSearchResultHarness> {
    return new HarnessPredicate(
      SkyAutocompleteSearchResultHarness,
      filters
    ).addOption('textContent', filters.textContent, async (harness, text) =>
      HarnessPredicate.stringMatches((await harness.host()).text(), text)
    );
  }

  public async hasCustomTemplate(): Promise<boolean> {
    return (await this.host()).hasClass('sky-autocomplete-result-custom');
  }

  public async click(): Promise<void> {
    return (await this.host()).click();
  }
}
