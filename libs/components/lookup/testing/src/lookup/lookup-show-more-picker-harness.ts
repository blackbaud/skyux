import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import { SkyRepeaterItemHarness } from '@skyux/lists/testing';

import { SkySearchHarness } from '../search/search-harness';

interface SearchResultFilters extends BaseHarnessFilters {
  textContent?: string | RegExp;
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

  public async selectSearchResults(filters: { textContent: string | RegExp }) {
    const harnesses = await this.getSearchResults(filters);
    if (harnesses && harnesses.length > 0) {
      if (await this.#isSingleSelect()) {
        await (await harnesses[0].host()).click();
      } else {
        for (const harness of harnesses) {
          await harness.select();
        }
      }
    }
  }

  public async saveAndClose() {
    await (
      await (
        await this.locatorFor('button.sky-lookup-show-more-modal-save')
      )()
    ).click();
  }

  public async cancel() {
    await (
      await (
        await this.locatorFor('button.sky-lookup-show-more-modal-close')
      )()
    ).click();
  }

  async #isSingleSelect(): Promise<boolean> {
    return (await this.host()).hasClass('sky-lookup-show-more-modal-single');
  }

  public async getSearchResults(
    filters?: Omit<SearchResultFilters, 'ancestor'>
  ): Promise<SkyRepeaterItemHarness[]> {
    const modalId = (await (await this.host()).getAttribute('id')) as string;

    const harnesses = await this.locatorForAll(
      SkyRepeaterItemHarness.with({
        ...(filters || {}),
        ancestor: `#${modalId}`,
      })
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

  public async clearAll(): Promise<void> {
    const button = await (
      await this.locatorFor('button.sky-lookup-show-more-modal-clear-all-btn')
    )();
    button.click();
  }

  public async selectAll(): Promise<void> {
    const button = await (
      await this.locatorFor('button.sky-lookup-show-more-modal-select-all-btn')
    )();
    button.click();
  }
}
