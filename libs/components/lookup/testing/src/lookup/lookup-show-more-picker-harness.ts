import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

import { SkySearchHarness } from '../search/search-harness';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SkyLookupShowMorePickerHarnessFilters extends BaseHarnessFilters {}

export class SkyLookupShowMorePickerHarness extends ComponentHarness {
  // Use the class name since the async and non-async pickers use different components.
  public static hostSelector = '.sky-lookup-show-more-modal';

  #getSearchHarness = this.locatorFor(SkySearchHarness);

  public static with(
    filters: SkyLookupShowMorePickerHarnessFilters
  ): HarnessPredicate<SkyLookupShowMorePickerHarness> {
    return new HarnessPredicate(SkyLookupShowMorePickerHarness, filters);
  }

  public async enterSearchText(value: string) {
    const searchHarness = await this.#getSearchHarness();
    await searchHarness.enterText(value);
  }

  public async selectSearchResult(filters: { textContent: string }) {}

  public async saveAndClose() {}

  // TODO
  // Enter text and search in modal
  // Select one result in modal
  // Select multiple results in modal
  // Click cancel in modal
}
