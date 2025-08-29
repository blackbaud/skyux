import { ComponentHarness } from '@angular/cdk/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';
import {
  SkyInfiniteScrollHarness,
  SkyRepeaterItemHarness,
} from '@skyux/lists/testing';

import { SkySearchHarness } from '../search/search-harness';

import { SkySelectionModalSearchResultHarness } from './selection-modal-search-result-harness';
import { SkySelectionModalSearchResultHarnessFilters } from './selection-modal-search-result-harness-filters';

/**
 * Harness for interacting with a selection modal in tests.
 */
export class SkySelectionModalHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-lookup-show-more-modal';

  #getCancelButton = this.locatorFor('button.sky-lookup-show-more-modal-close');

  #getClearAllButton = this.locatorForOptional(
    'button.sky-lookup-show-more-modal-clear-all-btn',
  );

  #getCheckboxHarness = this.locatorFor(SkyCheckboxHarness);

  #getInfiniteScroll = this.locatorFor(SkyInfiniteScrollHarness);

  #getSaveButton = this.locatorFor('button.sky-lookup-show-more-modal-save');

  #getSearchHarness = this.locatorFor(SkySearchHarness);

  #getSelectAllButton = this.locatorForOptional(
    'button.sky-lookup-show-more-modal-select-all-btn',
  );

  #getAddButton = this.locatorForOptional(
    'button.sky-lookup-show-more-modal-add',
  );

  /**
   * Clears the text of the search input.
   */
  public async clearSearchText(): Promise<void> {
    await (await this.#getSearchHarness()).clear();
  }

  /**
   * Enters text into the search input and performs a search.
   */
  public async enterSearchText(value: string): Promise<void> {
    await (await this.#getSearchHarness()).enterText(value);
  }

  /**
   * Gets the search input's aria-label.
   */
  public async getSearchAriaLabel(): Promise<string | null> {
    return await (await this.#getSearchHarness()).getAriaLabel();
  }

  /**
   * Selects multiple search results based on a set of criteria.
   */
  public async selectSearchResult(
    filters?: SkySelectionModalSearchResultHarnessFilters,
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
    await (await this.#getSaveButton()).click();
  }

  /**
   *
   * Gets the save button's aria-label.
   */
  public async getSaveButtonAriaLabel(): Promise<string | null> {
    return await (await this.#getSaveButton()).getAttribute('aria-label');
  }

  /**
   * Closes the picker without saving any selections made.
   */
  public async cancel(): Promise<void> {
    await (await this.#getCancelButton()).click();
  }

  /**
   * Gets a specific search result based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getSearchResult(
    filter: SkySelectionModalSearchResultHarnessFilters,
  ): Promise<SkySelectionModalSearchResultHarness> {
    const pickerId = (await (await this.host()).getAttribute('id')) as string;

    return await this.locatorFor(
      SkyRepeaterItemHarness.with({
        ...filter,
        ancestor: `#${pickerId}`,
      }),
    )();
  }

  /**
   * Gets an array of search results based on the filter criteria.
   * If no filter is provided, returns all search results.
   * @param filters The optional filter criteria.
   */
  public async getSearchResults(
    filters?: SkySelectionModalSearchResultHarnessFilters,
  ): Promise<SkySelectionModalSearchResultHarness[]> {
    const pickerId = (await (await this.host()).getAttribute('id')) as string;

    return await this.locatorForAll(
      SkyRepeaterItemHarness.with({
        ...(filters || {}),
        ancestor: `#${pickerId}`,
      }),
    )();
  }

  /**
   * Clears all selections made.
   */
  public async clearAll(): Promise<void> {
    const button = await this.#getClearAllButton();
    if (!button) {
      throw new Error(
        'Could not clear all selections because the "Clear all" button could not be found.',
      );
    }

    await button.click();
  }

  /**
   *
   * Gets the clear all button's aria-label.
   */
  public async getClearAllButtonAriaLabel(): Promise<string | null> {
    const button = await this.#getClearAllButton();

    if (!button) {
      throw new Error(
        'Could not get the aria-label for the clear all button because the "Clear all" button could not be found.',
      );
    }

    return await button.getAttribute('aria-label');
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
        'Could not select all selections because the "Select all" button could not be found.',
      );
    }

    await button.click();
  }

  /**
   *
   * Gets the select all button's aria-label.
   */
  public async getSelectAllButtonAriaLabel(): Promise<string | null> {
    const button = await this.#getSelectAllButton();

    if (!button) {
      throw new Error(
        'Could not get the aria-label for the select all button because the "Select all" button could not be found.',
      );
    }

    return await button.getAttribute('aria-label');
  }

  /**
   * Loads more results in the picker.
   */
  public async loadMore(): Promise<void> {
    await (await this.#getInfiniteScroll()).loadMore();
  }

  /**
   * Whether the selection modal is configured to show the add button.
   */
  public async hasAddButton(): Promise<boolean> {
    const button = await this.#getAddButton();
    return !!button;
  }

  /**
   * Clicks the add button.
   */
  public async clickAddButton(): Promise<void> {
    const button = await this.#getAddButton();
    if (!button) {
      throw new Error(
        'Could not click the add button because the button could not be found.',
      );
    }

    await button.click();
  }

  /**
   * Gets the "Only show selected" checkbox's aria-label
   */
  public async getOnlyShowSelectedAriaLabel(): Promise<string | null> {
    try {
      const label = await (await this.#getCheckboxHarness()).getAriaLabel();

      return label;
    } catch {
      throw new Error(
        'Could not get the "Show only selected items" checkbox because it could not be found.',
      );
    }
  }
}
