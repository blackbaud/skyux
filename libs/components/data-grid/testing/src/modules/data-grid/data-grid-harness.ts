import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
  TestElement,
} from '@angular/cdk/testing';
import { SkyAgGridWrapperHarness } from '@skyux/ag-grid/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';
import { SkyPagingHarness } from '@skyux/lists/testing';

import { SkyDataGridHarnessFilters } from './data-grid-harness.filters';

/**
 * Harness for interacting with SKY UX data grid components in tests.
 * Add `provideSkyDataGridTesting()` to the spec's providers so the harness
 * can wait for the grid to finish rendering; without it, render-readiness
 * waits are skipped.
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
   * Clicks the column header sort button and waits for the grid to re-render
   * the sorted rows, and for a consumer's own `[(sort)]` binding to reflect
   * the change, before resolving.
   */
  public async clickColumnSortButton(column: string): Promise<void> {
    const grid = await this.#getGridWrapper();
    const api = await grid.getGridApi();
    const renderCountBeforeClick = await grid.getRenderCount();
    // AG Grid's `sortChanged` event (which `SkyDataGrid`'s own `[(sort)]`
    // binding listens for) is dispatched independently of the `modelUpdated`
    // render event `waitUntilRendered()` waits for below, so wait for it
    // explicitly instead of guessing how many stabilize passes are enough
    // for it to have already fired.
    let handler!: () => void;
    const sortChanged = new Promise<void>((resolve) => {
      handler = (): void => resolve();
      api.addEventListener('sortChanged', handler);
    });
    const btn = await this.locatorFor(
      `.ag-header-cell.ag-header-cell-sortable[col-id="${column}"] button.ag-header-cell-label-sortable`,
    )();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      await btn.click();
      await grid.waitUntilRendered(renderCountBeforeClick);
      await Promise.race([
        sortChanged,
        new Promise((resolve) => {
          timeoutId = setTimeout(resolve, 2000);
        }),
      ]);
    } finally {
      clearTimeout(timeoutId);
      api.removeEventListener('sortChanged', handler);
    }
    await this.forceStabilize();
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

  /**
   * Returns a child harness after the grid has finished rendering, or throws
   * an error if the harness is not found.
   */
  public override async queryHarness<T extends ComponentHarness>(
    query: HarnessQuery<T>,
  ): Promise<T> {
    await this.#waitForGridWrapperRendered();
    return await super.queryHarness(query);
  }

  /**
   * Returns a child harness after the grid has finished rendering, or `null`
   * if not found.
   */
  public override async queryHarnessOrNull<T extends ComponentHarness>(
    query: HarnessQuery<T>,
  ): Promise<T | null> {
    await this.#waitForGridWrapperRendered();
    return await super.queryHarnessOrNull(query);
  }

  /**
   * Returns all child harnesses that match after the grid has finished
   * rendering.
   */
  public override async queryHarnesses<T extends ComponentHarness>(
    query: HarnessQuery<T>,
  ): Promise<T[]> {
    await this.#waitForGridWrapperRendered();
    return await super.queryHarnesses(query);
  }

  /**
   * Returns a child test element after the grid has finished rendering, or
   * throws an error if not found.
   */
  public override async querySelector(selector: string): Promise<TestElement> {
    await this.#waitForGridWrapperRendered();
    return await super.querySelector(selector);
  }

  /**
   * Returns a child test element after the grid has finished rendering, or
   * `null` if not found.
   */
  public override async querySelectorOrNull(
    selector: string,
  ): Promise<TestElement | null> {
    await this.#waitForGridWrapperRendered();
    return await super.querySelectorOrNull(selector);
  }

  /**
   * Returns all child test elements that match after the grid has finished
   * rendering.
   */
  public override async querySelectorAll(
    selector: string,
  ): Promise<TestElement[]> {
    await this.#waitForGridWrapperRendered();
    return await super.querySelectorAll(selector);
  }

  /**
   * Bypasses the render-readiness wait to avoid recursing through it while
   * checking readiness itself.
   */
  async #getGridWrapper(): Promise<SkyAgGridWrapperHarness> {
    return await super.queryHarness(SkyAgGridWrapperHarness);
  }

  async #waitForGridWrapperRendered(): Promise<void> {
    await this.#getGridWrapper()
      .then(async (grid) => await grid.waitUntilRendered())
      .catch(() => undefined);
  }
}
