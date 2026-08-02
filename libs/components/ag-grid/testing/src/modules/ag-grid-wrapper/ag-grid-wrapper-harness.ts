import { HarnessPredicate } from '@angular/cdk/testing';
import { UnitTestElement } from '@angular/cdk/testing/testbed';
import { SkyComponentHarness } from '@skyux/core/testing';

import { GridApi, getGridApi } from 'ag-grid-community';

import {
  getMsSinceLastRender,
  getRenderCount as getTrackedRenderCount,
  isRenderTrackingActive,
} from '../ag-grid/ag-grid-render-tracking';

import { SkyAgGridWrapperHarnessFilters } from './ag-grid-wrapper-harness.filters';

/**
 * Harness for interacting with SKY UX AG Grid components in tests.
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
   * @internal
   * The number of `modelUpdated` render passes AG Grid has completed for
   * this grid so far. Callers that need to observe the *next* render (e.g.
   * after triggering a sort) should capture this before acting, then pass it
   * to `waitUntilRendered()`.
   */
  public async getRenderCount(): Promise<number> {
    return getTrackedRenderCount(await this.#locateGridApi());
  }

  /**
   * @internal
   * Waits, on a bounded wall-clock poll, until the grid has completed more
   * than `afterCount` render passes. Defaults to `0`, i.e. "has rendered at
   * least once" - use this instead of `whenStable()`/`waitForTasksOutsideAngular()`,
   * since AG Grid 36 schedules its render work outside the Angular zone.
   */
  public async waitUntilRendered(afterCount = 0): Promise<void> {
    if (!isRenderTrackingActive()) {
      return;
    }
    const api = await this.#locateGridApi();
    await this.#waitForRenderCount(api, (count) => count > afterCount);
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
      !predicate(getTrackedRenderCount(api)) ||
      getMsSinceLastRender(api) < settleMs
    ) {
      if (Date.now() >= deadline) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
}
