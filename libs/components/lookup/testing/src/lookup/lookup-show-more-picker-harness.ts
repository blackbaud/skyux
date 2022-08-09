import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import { SkyRepeaterItemHarness } from '@skyux/lists/testing';

import { SkySearchHarness } from '../search/search-harness';

interface SearchResultFilters extends BaseHarnessFilters {
  textContent?: string;
}

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

  public async selectSearchResult(filters: { textContent: string }) {
    const harnesses = await this.#getSearchResultHarnesses(filters);
    if (harnesses && harnesses.length > 0) {
      await harnesses[0].click();
    }
  }

  public async saveAndClose() {
    await (
      await (
        await this.locatorFor('button.sky-lookup-show-more-modal-save')
      )()
    ).click();
  }

  async #getSearchResultHarnesses(
    filters?: SearchResultFilters
  ): Promise<SkyRepeaterItemHarness[]> {
    const harnesses = await this.locatorForAll(
      SkyRepeaterItemHarness.with(filters || {})
    )();

    if (!harnesses || harnesses.length === 0) {
      throw new Error(
        `Could not find search results in the picker matching filter(s): ${JSON.stringify(
          filters
        )}`
      );
    }

    return harnesses;
  }

  // TODO
  // Enter text and search in modal
  // Select one result in modal
  // Select multiple results in modal
  // Click cancel in modal
}
