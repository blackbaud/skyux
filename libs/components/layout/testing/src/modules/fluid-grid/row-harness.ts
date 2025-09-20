import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyColumnHarness } from './column-harness';
import { SkyRowHarnessFilters } from './row-harness-filters';

/**
 * Harness for interacting with a fluid grid column component in tests.
 */
export class SkyRowHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-row';

  #getRow = this.locatorFor('.sky-row');
  #getColumns = this.locatorForAll(SkyColumnHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyRowHarness` that meets certain criteria
   */
  public static with(
    filters: SkyRowHarnessFilters,
  ): HarnessPredicate<SkyRowHarness> {
    return SkyRowHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets all of the columns in the row.
   */
  public async getColumns(): Promise<SkyColumnHarness[]> {
    return await this.#getColumns();
  }

  /**
   * Gets the ordering of the columns in the row.
   * @returns `normal` | `reverse`
   */
  public async getColumnOrder(): Promise<string> {
    const row = await this.#getRow();

    return (await row.hasClass('sky-row-reverse')) ? 'reverse' : 'normal';
  }
}
