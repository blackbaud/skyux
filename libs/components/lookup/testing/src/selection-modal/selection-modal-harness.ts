import { ComponentHarness } from '@angular/cdk/testing';
import {
  SkyInfiniteScrollHarness,
  SkyRepeaterItemHarness,
} from '@skyux/lists/testing';

import { SkySearchHarness } from '../search/search-harness';

import { SkySelectionModalSearchResultHarness } from './selection-modal-search-result-harness';
import { SkySelectionModalSearchResultHarnessFilters } from './selection-modal-search-result-harness-filters';

/**
 * Harness for interacting with a selection modal in tests.
 * @internal
 */
export class SkySelectionModalHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-lookup-show-more-modal';

  #getCancelButton = this.locatorFor('button.sky-lookup-show-more-modal-close');

  #getClearAllButton = this.locatorForOptional(
    'button.sky-lookup-show-more-modal-clear-all-btn'
  );

  #getInfiniteScroll = this.locatorFor(SkyInfiniteScrollHarness);

  #getSaveButton = this.locatorFor('button.sky-lookup-show-more-modal-save');

  #getSearchHarness = this.locatorFor(SkySearchHarness);

  #getSelectAllButton = this.locatorForOptional(
    'button.sky-lookup-show-more-modal-select-all-btn'
  );

  /**
   * Clears the text of the search input.
   */
  public async clearSearchText(): Promise<void> {
    return (await this.#getSearchHarness()).clear();
  }

  /**
   * Enters text into the search input and performs a search.
   */
  public async enterSearchText(value: string): Promise<void> {
    return (await this.#getSearchHarness()).enterText(value);
  }

  /**
   * Selects multiple search results based on a set of criteria.
   */
  public async selectSearchResult(
    filters?: SkySelectionModalSearchResultHarnessFilters
  ): Promise<void> {
    const harnesses = await this.getSearchResults(filters);

    if (await this.isMultiselect()) {
      for (const harness of harnesses) {
        await harness.select();
      }
    } else {
      // Click on the item directly because we've added a custom click event in the picker's template.
      await (await harnesses[0].host()).click();
    }
  }

  /**
   * Saves any selections made and closes the modal.
   */
  public async saveAndClose(): Promise<void> {
    return (await this.#getSaveButton()).click();
  }

  /**
   * Closes the picker without saving any selections made.
   */
  public async cancel(): Promise<void> {
    return (await this.#getCancelButton()).click();
  }

  /**
   * Gets a list of search results.
   */
  public async getSearchResults(
    filters?: SkySelectionModalSearchResultHarnessFilters
  ): Promise<SkySelectionModalSearchResultHarness[]> {
    const pickerId = (await (await this.host()).getAttribute('id')) as string;

    const harnesses = await this.locatorForAll(
      SkyRepeaterItemHarness.with({
        ...(filters || {}),
        ancestor: `#${pickerId}`,
      })
    )();

    if (filters && harnesses.length === 0) {
      throw new Error(
        `Could not find search results in the picker matching filter(s): ${JSON.stringify(
          filters
        )}`
      );
    }

    return harnesses;
  }

  /**
   * Clears all selections made.
   */
  public async clearAll(): Promise<void> {
    const button = await this.#getClearAllButton();
    if (!button) {
      throw new Error(
        'Could not clear all selections because the "Clear all" button could not be found.'
      );
    }

    await button.click();
  }

  /**
   * Whether the selection modal is configured to allow multiple selections.
   */
  public async isMultiselect(): Promise<boolean> {
    return !(await (
      await this.host()
    ).hasClass('sky-lookup-show-more-modal-single'));
  }

  /**
   * Selects all search results.
   */
  public async selectAll(): Promise<void> {
    const button = await this.#getSelectAllButton();
    if (!button) {
      throw new Error(
        'Could not select all selections because the "Select all" button could not be found.'
      );
    }

    await button.click();
  }

  /**
   * Loads more results in the picker.
   */
  public async loadMore(): Promise<void> {
    return (await this.#getInfiniteScroll()).loadMore();
  }
}
