import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyAgGridWrapperHarness } from '@skyux/ag-grid/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';
import { SkyPagingHarness } from '@skyux/lists/testing';

import { SkyDataGridHarnessFilters } from './data-grid-harness.filters';

/**
 * Harness for interacting with SKY UX data grid components in tests.
 * @preview
 */
export class SkyDataGridHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-data-grid';

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
   * Checks whether the grid is loading.
   */
  public async isLoading(): Promise<boolean> {
    const waits = await this.queryHarnesses(SkyWaitHarness);
    return await Promise.all(
      waits.map(async (wait): Promise<boolean> => await wait.isWaiting()),
    ).then((loadingStates) => loadingStates.some((isLoading) => isLoading));
  }

  /**
   * Retrieves the IDs of the currently displayed columns.
   */
  public async getDisplayedColumnIds(): Promise<string[]> {
    return await this.#getGridWrapper()
      .then(async (grid) => await grid.getDisplayedColumnIds())
      .catch(() =>
        Promise.reject(new Error('Unable to retrieve displayed column IDs.')),
      );
  }

  /**
   * Retrieves the header names of the currently displayed columns.
   */
  public async getDisplayedColumnHeaderNames(): Promise<string[]> {
    return await this.#getGridWrapper()
      .then(async (grid) => await grid.getDisplayedColumnHeaderNames())
      .catch(() =>
        Promise.reject(
          new Error('Unable to retrieve displayed column header names.'),
        ),
      );
  }

  /**
   * Retrieves the total number of displayed rows.
   */
  public async getDisplayedRowCount(): Promise<number> {
    return await this.#getGridWrapper()
      .then(async (grid) => (await grid.getGridApi()).getDisplayedRowCount())
      .catch(() =>
        Promise.reject(
          new Error('Unable to retrieve total number of displayed rows.'),
        ),
      );
  }

  /**
   * Clicks the column header sort button.
   */
  public async clickColumnSortButton(column: string): Promise<void> {
    const btn = await this.locatorFor(
      `.ag-header-cell.ag-header-cell-sortable[col-id="${column}"] button.ag-header-cell-label-sortable`,
    )();
    await btn.click();
  }

  /**
   * Gets the paging harness for the data grid. Throws if the grid is not paged.
   */
  public async getPaging(): Promise<SkyPagingHarness> {
    const paging = await this.getPagingOrNull();

    if (paging === null) {
      throw new Error('Unable to retrieve paging. The data grid is not paged.');
    }

    return paging;
  }

  /**
   * Gets the paging harness for the data grid, or `null` if the grid is not paged.
   */
  public async getPagingOrNull(): Promise<SkyPagingHarness | null> {
    return await this.queryHarnessOrNull(SkyPagingHarness);
  }

  /**
   * Gets the wait harness for the data grid.
   */
  public async getWait(): Promise<SkyWaitHarness> {
    return await this.queryHarness(SkyWaitHarness);
  }

  async #getGridWrapper(): Promise<SkyAgGridWrapperHarness> {
    return await this.queryHarness(SkyAgGridWrapperHarness);
  }
}
