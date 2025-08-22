import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySelectionBoxGridHarnessFilters } from './selection-box-grid-harness-filters';
import { SkySelectionBoxHarness } from './selection-box-harness';
import { SkySelectionBoxHarnessFilters } from './selection-box-harness-filters';

/**
 * Harness for interacting with a selection box grid component in tests.
 */
export class SkySelectionBoxGridHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-selection-box-grid';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySelectionBoxGridHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySelectionBoxGridHarnessFilters,
  ): HarnessPredicate<SkySelectionBoxGridHarness> {
    return SkySelectionBoxGridHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a harness for a specific selection box that meets certain criteria.
   */
  public async getSelectionBox(
    filter: SkySelectionBoxHarnessFilters,
  ): Promise<SkySelectionBoxHarness> {
    return await this.locatorFor(SkySelectionBoxHarness.with(filter))();
  }

  /**
   * Gets an array of selection boxes.
   */
  public async getSelectionBoxes(
    filters?: SkySelectionBoxHarnessFilters,
  ): Promise<SkySelectionBoxHarness[]> {
    return await this.locatorForAll(
      SkySelectionBoxHarness.with(filters || {}),
    )();
  }
}
