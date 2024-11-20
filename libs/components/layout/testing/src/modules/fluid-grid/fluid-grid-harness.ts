import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFluidGridHarnessFilters } from './fluid-grid-harness-filters';
import { SkyRowHarness } from './row-harness';

/**
 * Harness for interacting with a fluid grid component in tests.
 */
export class SkyFluidGridHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-fluid-grid';

  #getGrid = this.locatorFor('.sky-fluid-grid');
  #getRows = this.locatorForAll(SkyRowHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFluidGridHarness` that meets certain criteria
   */
  public static with(
    filters: SkyFluidGridHarnessFilters,
  ): HarnessPredicate<SkyFluidGridHarness> {
    return SkyFluidGridHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the gutter size for the grid.
   */
  public async getGutterSize(): Promise<string> {
    const grid = await this.#getGrid();

    const small = await grid.hasClass('sky-fluid-grid-gutter-size-small');
    const medium = await grid.hasClass('sky-fluid-grid-gutter-size-medium');

    if (small) {
      return 'small';
    } else if (medium) {
      return 'medium';
    } else {
      return 'large';
    }
  }

  /**
   * Gets all of the rows in the grid.
   */
  public async getRows(): Promise<SkyRowHarness[]> {
    return await this.#getRows();
  }

  /**
   * Whether the fluid grid has margin enabled.
   */
  public async hasMargin(): Promise<boolean> {
    return !(await (
      await this.#getGrid()
    ).hasClass('sky-fluid-grid-no-margin'));
  }
}
