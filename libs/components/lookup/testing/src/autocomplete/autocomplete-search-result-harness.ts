import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyAutocompleteSearchResultHarnessFilters } from './autocomplete-search-result-filters';

// TODO: Better to just put this as a selector in the autocomplete harness?
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

  public async select(): Promise<void> {
    return (await this.host()).click();
  }
}
