import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyToolbarItemHarness } from './toolbar-item-harness';
import { SkyToolbarItemHarnessFilters } from './toolbar-item-harness-filters';
import { SkyToolbarSectionHarnessFilters } from './toolbar-section-harness-filters';
import { SkyToolbarViewActionsHarness } from './toolbar-view-actions-harness';

/**
 * Harness to interact with a toolbar section component in tests.
 */
export class SkyToolbarSectionHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-toolbar-section';

  #getViewActions = this.locatorForOptional(SkyToolbarViewActionsHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyToolbarSectionHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyToolbarSectionHarnessFilters,
  ): HarnessPredicate<SkyToolbarSectionHarness> {
    return SkyToolbarSectionHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a specific toolbar item that meets certain criteria.
   */
  public async getItem(
    filter: SkyToolbarItemHarnessFilters,
  ): Promise<SkyToolbarItemHarness> {
    return await this.locatorFor(SkyToolbarItemHarness.with(filter))();
  }

  /**
   * Gets an array of toolbar items.
   */
  public async getItems(
    filters?: SkyToolbarItemHarnessFilters,
  ): Promise<SkyToolbarItemHarness[]> {
    return await this.locatorForAll(
      SkyToolbarItemHarness.with(filters || {}),
    )();
  }

  /**
   * Gets the harness to interact with the toolbar's view actions.
   */
  public async getViewActions(): Promise<SkyToolbarViewActionsHarness> {
    const actions = await this.#getViewActions();

    if (actions === null) {
      throw Error('Unable to find toolbar section view actions.');
    }

    return actions;
  }
}
