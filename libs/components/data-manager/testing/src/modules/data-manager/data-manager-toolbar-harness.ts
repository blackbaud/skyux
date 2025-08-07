import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyCheckboxHarness, SkyRadioGroupHarness } from '@skyux/forms/testing';
import { SkyFilterButtonHarness, SkySortHarness } from '@skyux/lists/testing';
import { SkySearchHarness } from '@skyux/lookup/testing';

import { SkyDataManagerColumnPickerHarness } from './data-manager-column-picker-harness';
import { SkyDataManagerToolbarHarnessFilters } from './data-manager-toolbar-harness-filters';
import { SkyDataManagerToolbarLeftItemHarness } from './data-manager-toolbar-left-item-harness';
import { SkyDataManagerToolbarLeftItemHarnessFilters } from './data-manager-toolbar-left-item-harness-filters';
import { SkyDataManagerToolbarPrimaryItemHarness } from './data-manager-toolbar-primary-item-harness';
import { SkyDataManagerToolbarPrimaryItemHarnessFilters } from './data-manager-toolbar-primary-item-harness-filters';
import { SkyDataManagerToolbarRightItemHarness } from './data-manager-toolbar-right-item-harness';
import { SkyDataManagerToolbarRightItemHarnessFilters } from './data-manager-toolbar-right-item-harness-filters';
import { SkyDataManagerToolbarSectionHarness } from './data-manager-toolbar-section-harness';
import { SkyDataManagerToolbarSectionHarnessFilters } from './data-manager-toolbar-section-harness-filters';

/**
 * Harness for interacting with a data manager toolbar component in tests.
 */
export class SkyDataManagerToolbarHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-data-manager-toolbar';

  #documentRootLocator = this.documentRootLocatorFactory();

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDataManagerToolbarHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDataManagerToolbarHarnessFilters,
  ): HarnessPredicate<SkyDataManagerToolbarHarness> {
    return SkyDataManagerToolbarHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the data manager clear all button. Throws an error if the multiselect toolbar is turned off.
   */
  public async clickClearAll(): Promise<void> {
    const button = await this.locatorForOptional(
      '.sky-data-manager-clear-all-btn',
    )();

    if (button === null) {
      throw new Error('Unable to find the data manager clear all button.');
    }

    await button.click();
  }

  /**
   * Clicks the data manager select all button. Throws an error if the multiselect toolbar is turned off.
   */
  public async clickSelectAll(): Promise<void> {
    const button = await this.locatorForOptional(
      '.sky-data-manager-select-all-btn',
    )();

    if (button === null) {
      throw new Error('Unable to find the data manager select all button.');
    }

    await button.click();
  }

  /**
   * Gets a harness for the data manager filter button.
   */
  public async getFilterButton(): Promise<SkyFilterButtonHarness | null> {
    return await this.locatorForOptional(
      SkyFilterButtonHarness.with({
        ancestor: 'sky-toolbar-item.sky-data-manager-filter',
      }),
    )();
  }

  /**
   * Gets a harness for a specific data manager toolbar left item that meets certain criteria.
   */
  public async getLeftItem(
    filter: SkyDataManagerToolbarLeftItemHarnessFilters,
  ): Promise<SkyDataManagerToolbarLeftItemHarness> {
    return await this.locatorFor(
      SkyDataManagerToolbarLeftItemHarness.with(filter),
    )();
  }

  /**
   * Gets an array of all data manager toolbar left items.
   */
  public async getLeftItems(
    filters?: SkyDataManagerToolbarLeftItemHarnessFilters,
  ): Promise<SkyDataManagerToolbarLeftItemHarness[]> {
    const items = await this.locatorForAll(
      SkyDataManagerToolbarLeftItemHarness.with(filters || {}),
    )();

    if (filters && items.length === 0) {
      throw new Error(
        `Unable to find any data manager toolbar left items with filter(s): ${JSON.stringify(filters)}`,
      );
    }

    return items;
  }

  /**
   * Gets a harness for the only show selected checkbox.
   */
  public async getOnlyShowSelected(): Promise<SkyCheckboxHarness | null> {
    return await this.locatorForOptional(
      SkyCheckboxHarness.with({
        ancestor:
          'sky-toolbar-view-actions.sky-data-manager-only-show-selected',
      }),
    )();
  }

  /**
   * Gets a harness for a specific data manager toolbar primary item that meets certain criteria.
   */
  public async getPrimaryItem(
    filter: SkyDataManagerToolbarPrimaryItemHarnessFilters,
  ): Promise<SkyDataManagerToolbarPrimaryItemHarness> {
    return await this.locatorFor(
      SkyDataManagerToolbarPrimaryItemHarness.with(filter),
    )();
  }

  /**
   * Gets an array of all data manager toolbar primary items.
   */
  public async getPrimaryItems(
    filters?: SkyDataManagerToolbarPrimaryItemHarnessFilters,
  ): Promise<SkyDataManagerToolbarPrimaryItemHarness[]> {
    const items = await this.locatorForAll(
      SkyDataManagerToolbarPrimaryItemHarness.with(filters || {}),
    )();

    if (filters && items.length === 0) {
      throw new Error(
        `Unable to find any data manager toolbar primary items with filter(s): ${JSON.stringify(filters)}`,
      );
    }

    return items;
  }

  /**
   * Gets a harness for a specific data manager toolbar right item that meets certain criteria.
   */
  public async getRightItem(
    filter: SkyDataManagerToolbarRightItemHarnessFilters,
  ): Promise<SkyDataManagerToolbarRightItemHarness> {
    return await this.locatorFor(
      SkyDataManagerToolbarRightItemHarness.with(filter),
    )();
  }

  /**
   * Gets an array of all data manager toolbar right items.
   */
  public async getRightItems(
    filters?: SkyDataManagerToolbarRightItemHarnessFilters,
  ): Promise<SkyDataManagerToolbarRightItemHarness[]> {
    const items = await this.locatorForAll(
      SkyDataManagerToolbarRightItemHarness.with(filters || {}),
    )();

    if (filters && items.length === 0) {
      throw new Error(
        `Unable to find any data manager toolbar right items with filter(s): ${JSON.stringify(filters)}`,
      );
    }

    return items;
  }

  /**
   * Gets the data manager search harness.
   */
  public async getSearch(): Promise<SkySearchHarness | null> {
    return await this.locatorForOptional(
      SkySearchHarness.with({
        ancestor: 'sky-toolbar-item.sky-data-manager-search',
      }),
    )();
  }

  /**
   * Gets a harness for a specific toolbar section that meets certain criteria.
   */
  public async getSection(
    filter: SkyDataManagerToolbarSectionHarnessFilters,
  ): Promise<SkyDataManagerToolbarSectionHarness> {
    return await this.locatorFor(
      SkyDataManagerToolbarSectionHarness.with(filter),
    )();
  }

  /**
   * Gets an array of all toolbar sections.
   */
  public async getSections(
    filters?: SkyDataManagerToolbarSectionHarnessFilters,
  ): Promise<SkyDataManagerToolbarSectionHarness[]> {
    const sections = await this.locatorForAll(
      SkyDataManagerToolbarSectionHarness.with(filters || {}),
    )();

    if (filters && sections.length === 0) {
      throw new Error(
        `Unable to find any data manager toolbar sections with filter(s): ${JSON.stringify(filters)}`,
      );
    }

    return sections;
  }

  /**
   * Gets a harness for the data manager sort button.
   */
  public async getSortButton(): Promise<SkySortHarness | null> {
    return await this.locatorForOptional(
      SkySortHarness.with({
        ancestor: 'sky-toolbar-item.sky-data-manager-sort',
      }),
    )();
  }

  /**
   * Gets the harness to interact with the data manager toolbar's view actions.
   */
  public async getViewActions(): Promise<SkyRadioGroupHarness | null> {
    return await this.locatorForOptional(
      SkyRadioGroupHarness.with({ selector: '.sky-switch-icon-group' }),
    )();
  }

  /**
   * Opens the data manager column picker and returns the harness. Throws an error if the column picker is turned off.
   */
  public async openColumnPicker(): Promise<SkyDataManagerColumnPickerHarness> {
    const button = await this.locatorForOptional('.sky-col-picker-btn')();

    if (button === null) {
      throw new Error('Unable to find the data manager column picker button.');
    }

    await button.click();

    return await this.#documentRootLocator.locatorFor(
      SkyDataManagerColumnPickerHarness,
    )();
  }
}
