import { HarnessPredicate } from '@angular/cdk/testing';
import { UnitTestElement } from '@angular/cdk/testing/testbed';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyInlineDeleteHarness } from '@skyux/layout/testing';

import { GridApi, getGridApi } from 'ag-grid-community';

import { SkyAgGridWrapperHarnessFilters } from './ag-grid-wrapper-harness.filters';

/**
 * Harness for interacting with SKY UX AG Grid components in tests.
 */
export class SkyAgGridWrapperHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-ag-grid-wrapper';

  #getGrid = this.locatorFor('div.sky-ag-grid');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyAgGridWrapperHarness` that meets certain criteria
   */
  public static with(
    filters: SkyAgGridWrapperHarnessFilters,
  ): HarnessPredicate<SkyAgGridWrapperHarness> {
    return SkyAgGridWrapperHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Checks whether the grid is ready.
   */
  public async isGridReady(): Promise<boolean> {
    const gridReady = this.locatorFactory.locatorFor(
      '.ag-root.ag-unselectable',
    );

    return await gridReady()
      .then((el) => !!el)
      .catch(() => false);
  }

  /**
   * Retrieves the IDs of the currently displayed columns.
   */
  public async getDisplayedColumnIds(): Promise<string[]> {
    return await this.getGridApi()
      .then((api) => api.getAllDisplayedColumns().map((col) => col.getColId()))
      .catch(() => Promise.reject('Unable to retrieve displayed column IDs.'));
  }

  /**
   * Retrieves the header names of the currently displayed columns.
   */
  public async getDisplayedColumnHeaderNames(): Promise<string[]> {
    return await this.getGridApi()
      .then((api) =>
        api
          .getAllDisplayedColumns()
          .map((col) => col.getColDef().headerName || ''),
      )
      .catch(() =>
        Promise.reject('Unable to retrieve displayed column header names.'),
      );
  }

  /**
   * Gets the inline delete confirmation shown for a row by the
   * `skyAgGridRowDelete` directive, or `null` if the row is not showing one.
   * @param rowId The ID of the row.
   */
  public async getRowInlineDelete(
    rowId: string,
  ): Promise<SkyInlineDeleteHarness | null> {
    await this.waitForTasksOutsideAngular();
    // The row delete overlay updates after the grid renders, outside the
    // Angular zone, so let its change detection run before querying it.
    await new Promise((resolve) => setTimeout(resolve));
    await this.forceStabilize();
    // The overlay renders outside the grid, attached to the document body, and
    // is tagged with the grid's ID so rows from other grids are not matched.
    const gridId = await (await this.#getGrid()).getProperty<string>('id');
    const rowLoader =
      await this.documentRootLocatorFactory().harnessLoaderForOptional(
        `[data-sky-ag-grid-id="${CSS.escape(gridId)}"] #${CSS.escape(`row-delete-ref-${rowId}`)}`,
      );
    return (await rowLoader?.getHarnessOrNull(SkyInlineDeleteHarness)) ?? null;
  }

  /**
   * @internal
   */
  public async getGridApi(): Promise<GridApi> {
    await this.waitForTasksOutsideAngular();
    const locator = this.locatorFactory.locatorFor('ag-grid-angular');
    return await locator().then((grid) => {
      if (grid instanceof UnitTestElement) {
        const api = getGridApi(grid.element);
        if (api) {
          return api;
        }
      }
      // If this harness were used in an environment that did not provide UnitTestElement.
      /* istanbul ignore next */
      throw new Error('Unable to get GridApi from AgGridAngular component.');
    });
  }
}
