import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyAgGridWrapperHarness } from '@skyux/ag-grid/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyDataGridHarnessFilters } from './data-grid-harness.filters';

/**
 * Harness for interacting with SKY UX data grid components in tests.
 * @preview
 */
export class SkyDataGridHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-data-grid, sky-data-grid-lite';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDataGridHarness` that meets certain criteria
   */
  public static with(
    filters: SkyDataGridHarnessFilters,
  ): HarnessPredicate<SkyDataGridHarness> {
    return SkyDataGridHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Checks whether the grid is ready.
   */
  public async isGridReady(): Promise<boolean> {
    return await this.#getGridWrapper()
      .then(async (grid) => await grid.isGridReady())
      .catch(() => false);
  }

  /**
   * Retrieves the IDs of the currently displayed columns.
   */
  public async getDisplayedColumnIds(): Promise<string[]> {
    return await this.#getGridWrapper()
      .then(async (grid) => await grid.getDisplayedColumnIds())
      .catch(() => Promise.reject('Unable to retrieve displayed column IDs.'));
  }

  /**
   * Retrieves the header names of the currently displayed columns.
   */
  public async getDisplayedColumnHeaderNames(): Promise<string[]> {
    return await this.#getGridWrapper()
      .then(async (grid) => await grid.getDisplayedColumnHeaderNames())
      .catch(() =>
        Promise.reject('Unable to retrieve displayed column header names.'),
      );
  }

  async #getGridWrapper(): Promise<SkyAgGridWrapperHarness> {
    return await this.queryHarness(SkyAgGridWrapperHarness);
  }
}
