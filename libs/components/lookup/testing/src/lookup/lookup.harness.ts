import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyAutocompleteHarness } from '../autocomplete/autocomplete.harness';

import { SkyLookupHarnessFilters } from './lookup-harness-filters';

export class SkyLookupHarness extends SkyAutocompleteHarness {
  // Do not use `sky-lookup` since the component may be included in a select-box component.
  public static hostSelector = '.sky-lookup';

  public static with(
    options: SkyLookupHarnessFilters
  ): HarnessPredicate<SkyLookupHarness> {
    return new HarnessPredicate(SkyLookupHarness, options).addOption(
      'dataSkyId',
      options.dataSkyId,
      (harness, text) =>
        HarnessPredicate.stringMatches(harness.getSkyId(), text)
    );
  }
}
