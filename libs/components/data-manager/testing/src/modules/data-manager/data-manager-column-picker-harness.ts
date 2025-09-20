import { ComponentHarness } from '@angular/cdk/testing';
import { SkySearchHarness } from '@skyux/lookup/testing';

import { SkyDataManagerColumnPickerColumnHarness } from './data-manager-column-picker-column-harness';
import { SkyDataManagerColumnPickerColumnHarnessFilters } from './data-manager-column-picker-column-harness-filters';
import { SkyDataManagerHarness } from './data-manager-harness';
import { SkyDataManagerToolbarHarness } from './data-manager-toolbar-harness';

/**
 * Harness for interacting with a data manager column picker modal in tests.
 */
export class SkyDataManagerColumnPickerHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-data-manager-column-picker';

  #getCancelButton = this.locatorFor(
    'button.sky-data-manager-column-picker-cancel-btn',
  );
  #getDataManager = this.locatorFor(SkyDataManagerHarness);
  #getSaveButton = this.locatorFor(
    'button.sky-data-manager-column-picker-apply-btn',
  );

  /**
   * Clears the text of the search input.
   */
  public async clearSearchText(): Promise<void> {
    await (await this.#getSearchHarness())?.clear();
  }

  /**
   * Enters text into the search input and performs a search.
   */
  public async enterSearchText(value: string): Promise<void> {
    await (await this.#getSearchHarness())?.enterText(value);
  }

  /**
   * Selects multiple columns based on a set of criteria.
   */
  public async selectColumns(
    filters?: SkyDataManagerColumnPickerColumnHarnessFilters,
  ): Promise<void> {
    const harnesses = await this.getColumns(filters);

    for (const harness of harnesses) {
      await harness.select();
    }
  }

  /**
   * Saves any selections made and closes the modal.
   */
  public async saveAndClose(): Promise<void> {
    await (await this.#getSaveButton()).click();
  }

  /**
   * Closes the picker without saving any selections made.
   */
  public async cancel(): Promise<void> {
    await (await this.#getCancelButton()).click();
  }

  /**
   * Gets a specific column based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getColumn(
    filter: SkyDataManagerColumnPickerColumnHarnessFilters,
  ): Promise<SkyDataManagerColumnPickerColumnHarness> {
    return await this.locatorFor(
      SkyDataManagerColumnPickerColumnHarness.with(filter),
    )();
  }

  /**
   * Gets an array of columns based on the filter criteria.
   * If no filter is provided, returns all columns.
   * @param filters The optional filter criteria.
   */
  public async getColumns(
    filters?: SkyDataManagerColumnPickerColumnHarnessFilters,
  ): Promise<SkyDataManagerColumnPickerColumnHarness[]> {
    return await this.locatorForAll(
      SkyDataManagerColumnPickerColumnHarness.with(filters || {}),
    )();
  }

  /**
   * Clears all selections made.
   */
  public async clearAll(): Promise<void> {
    await (await this.#getToolbar()).clickClearAll();
  }

  /**
   * Selects all search results.
   */
  public async selectAll(): Promise<void> {
    await (await this.#getToolbar()).clickSelectAll();
  }

  async #getSearchHarness(): Promise<SkySearchHarness | null> {
    return await (await this.#getToolbar()).getSearch();
  }

  async #getToolbar(): Promise<SkyDataManagerToolbarHarness> {
    return await (await this.#getDataManager()).getToolbar();
  }
}
