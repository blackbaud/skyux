import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import {
  SkyInfiniteScrollHarness,
  SkyRepeaterItemHarness,
} from '@skyux/lists/testing';

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
    filters: Omit<SkyLookupShowMorePickerHarnessFilters, 'ancestor'>
  ): HarnessPredicate<SkyLookupShowMorePickerHarness> {
    return new HarnessPredicate(SkyLookupShowMorePickerHarness, filters);
  }

  public async clearSearchText(): Promise<void> {
    const searchHarness = await this.#getSearchHarness();
    await searchHarness.clear();
  }

  public async enterSearchText(value: string) {
    const searchHarness = await this.#getSearchHarness();
    await searchHarness.enterText(value);
  }

  public async selectFirstSearchResult() {
    const harnesses = await this.getSearchResults();
    if (harnesses && harnesses.length > 0) {
      await harnesses[0].select();
    }
  }

  public async selectSearchResult(filters: { textContent: string | RegExp }) {
    const harnesses = await this.getSearchResults(filters);
    // Click on the repeater because we've added a custom click event in the modal template.
    if (harnesses && harnesses.length > 0) {
      await (await harnesses[0].host()).click();
    }
  }

  public async selectSearchResults(filters: { textContent: string | RegExp }) {
    if (await this.#isSingleSelect()) {
      return this.selectSearchResult(filters);
    }

    const harnesses = await this.getSearchResults(filters);
    if (harnesses && harnesses.length > 0) {
      for (const harness of harnesses) {
        await harness.select();
      }
    }
  }

  public async saveAndClose() {
    const button = await this.locatorFor(
      'button.sky-lookup-show-more-modal-save'
    )();
    await button.click();
  }

  public async cancel() {
    await (
      await this.locatorFor('button.sky-lookup-show-more-modal-close')()
    ).click();
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
    const button = await this.locatorFor(
      'button.sky-lookup-show-more-modal-clear-all-btn'
    )();
    button.click();
  }

  public async selectAll(): Promise<void> {
    const button = await this.locatorFor(
      'button.sky-lookup-show-more-modal-select-all-btn'
    )();
    button.click();
  }

  public async loadMore(): Promise<void> {
    const infiniteScroll = await this.locatorFor(SkyInfiniteScrollHarness)();
    await infiniteScroll.loadMore();
  }

  async #isSingleSelect(): Promise<boolean> {
    return (await this.host()).hasClass('sky-lookup-show-more-modal-single');
  }
}
