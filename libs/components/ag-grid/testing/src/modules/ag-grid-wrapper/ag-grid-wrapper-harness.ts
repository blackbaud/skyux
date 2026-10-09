import { HarnessPredicate } from '@angular/cdk/testing';
import { UnitTestElement } from '@angular/cdk/testing/testbed';
import { SkyComponentHarness } from '@skyux/core/testing';

import { GridApi, getGridApi } from 'ag-grid-community';

import {
  getMsSinceLastRender,
  getRenderCount,
  isRenderTrackingActive,
} from '../ag-grid/ag-grid-render-tracking';

import { SkyAgGridWrapperHarnessFilters } from './ag-grid-wrapper-harness.filters';

/**
 * Harness for interacting with SKY UX AG Grid components in tests.
 * Add `provideSkyAgGridTesting()` to the spec's providers so the harness
 * can wait for the grid to finish rendering; without it, render-readiness
 * waits are skipped.
 */
export class SkyAgGridWrapperHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-ag-grid-wrapper';

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
   * @internal
   */
  public async getGridApi(): Promise<GridApi> {
    const api = await this.#locateGridApi();
    if (isRenderTrackingActive()) {
      await this.#waitForRenderCount(api, (count) => count > 0);
    }
    return api;
  }

  /**
   * Retrieves the formatted values of a column for the rows the grid currently
   * displays, in display order.
   * @param columnId The ID of the column.
   */
  public async getDisplayedCellValues(columnId: string): Promise<string[]> {
    const api = await this.getGridApi();
    if (!api.getColumn(columnId)) {
      throw new Error(`Unable to find column "${columnId}".`);
    }

    return api
      .getRenderedNodes()
      .map((rowNode) =>
        String(
          api.getCellValue({ rowNode, colKey: columnId, useFormatter: true }) ??
            '',
        ),
      );
  }

  /**
   * Waits until the grid finishes rendering. Use this instead of
   * `fixture.whenStable()`, since AG Grid renders outside the Angular zone.
   * Requires `provideSkyAgGridTesting()`; without it, this resolves without waiting.
   * @param action An action that causes the grid to render again, such as
   * entering search text. When provided, the action runs first, and this waits
   * for the render it causes.
   */
  public async waitUntilRendered(
    action?: () => Promise<void> | void,
  ): Promise<void> {
    if (!isRenderTrackingActive()) {
      await action?.();
      return;
    }
    const api = await this.#locateGridApi();
    const renderCountBeforeAction = action ? getRenderCount(api) : 0;
    await action?.();
    await this.#waitForRenderCount(
      api,
      (count) => count > renderCountBeforeAction,
    );
  }

  async #locateGridApi(): Promise<GridApi> {
    // Query the `.ag-root` element rather than `ag-grid-angular` itself, since
    // `skyViewkeeper`'s shadow element is inserted as `ag-grid-angular`'s
    // first child and `getGridApi()` locates the grid by walking up from the
    // queried element's first element child.
    const locator = this.locatorFactory.locatorFor('ag-grid-angular .ag-root');
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

  // A grid that loads data asynchronously (e.g. an Angular `resource()`) can
  // render an empty pass before its real data arrives, each firing its own
  // `modelUpdated`. Waiting for the predicate to become true isn't enough -
  // this also waits for the render count to stop moving for `settleMs`, so a
  // read doesn't land on that intermediate empty pass.
  async #waitForRenderCount(
    api: GridApi,
    predicate: (count: number) => boolean,
    timeoutMs = 2000,
    settleMs = 100,
  ): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    while (
      !predicate(getRenderCount(api)) ||
      getMsSinceLastRender(api) < settleMs
    ) {
      if (Date.now() >= deadline) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
}
