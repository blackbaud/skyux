import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyToolbarHarnessFilters } from './toolbar-harness-filters';
import { SkyToolbarItemHarness } from './toolbar-item-harness';
import { SkyToolbarItemHarnessFilters } from './toolbar-item-harness-filters';
import { SkyToolbarSectionHarness } from './toolbar-section-harness';
import { SkyToolbarSectionHarnessFilters } from './toolbar-section-harness-filters';
import { SkyToolbarViewActionsHarness } from './toolbar-view-actions-harness';

/**
 * Harness for interacting with a toolbar component in tests.
 */
export class SkyToolbarHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-toolbar';

  #getViewActions = this.locatorForOptional(SkyToolbarViewActionsHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyToolbarHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyToolbarHarnessFilters,
  ): HarnessPredicate<SkyToolbarHarness> {
    return SkyToolbarHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a specific toolbar item based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getItem(
    filter: SkyToolbarItemHarnessFilters,
  ): Promise<SkyToolbarItemHarness> {
    return await this.locatorFor(SkyToolbarItemHarness.with(filter))();
  }

  /**
   * Gets an array of toolbar items based on the filter criteria.
   * If no filter is provided, returns all toolbar items.
   * @param filters The optional filter criteria.
   */
  public async getItems(
    filters?: SkyToolbarItemHarnessFilters,
  ): Promise<SkyToolbarItemHarness[]> {
    return await this.locatorForAll(
      SkyToolbarItemHarness.with(filters || {}),
    )();
  }

  /**
   * Gets a specific toolbar section based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getSection(
    filter: SkyToolbarSectionHarnessFilters,
  ): Promise<SkyToolbarSectionHarness> {
    return await this.locatorFor(SkyToolbarSectionHarness.with(filter))();
  }

  /**
   * Gets an array of toolbar sections based on the filter criteria.
   * If no filter is provided, returns all toolbar sections.
   * @param filters The optional filter criteria.
   */
  public async getSections(
    filters?: SkyToolbarSectionHarnessFilters,
  ): Promise<SkyToolbarSectionHarness[]> {
    return await this.locatorForAll(
      SkyToolbarSectionHarness.with(filters || {}),
    )();
  }

  /**
   * Gets the harness to interact with the toolbar's view actions.
   */
  public async getViewActions(): Promise<SkyToolbarViewActionsHarness> {
    const actions = await this.#getViewActions();

    if (actions === null) {
      throw Error('Unable to find toolbar view actions.');
    }

    return actions;
  }
}
