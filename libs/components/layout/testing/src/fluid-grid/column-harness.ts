import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyColumnHarnessFilters } from './column-harness-filters';

const sizes = ['xs', 'sm', 'md', 'lg'];

/**
 * Harness for interacting with a fluid grid column component in tests.
 */
export class SkyColumnHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-column';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyColumnHarness` that meets certain criteria
   */
  public static with(
    filters: SkyColumnHarnessFilters,
  ): HarnessPredicate<SkyColumnHarness> {
    return SkyColumnHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the size of the column in an XSmall responsive context.
   */
  public async getXSmallSize(): Promise<number> {
    return await this.#getColumnSize(0);
  }

  /**
   * Gets the size of the column in a Small responsive context.
   */
  public async getSmallSize(): Promise<number> {
    return await this.#getColumnSize(1);
  }

  /**
   * Gets the size of the column in a Medium responsive context.
   */
  public async getMediumSize(): Promise<number> {
    return await this.#getColumnSize(2);
  }

  /**
   * Gets the size of the column in a Large responsive context.
   */
  public async getLargeSize(): Promise<number> {
    return await this.#getColumnSize(3);
  }

  async #getColumnSize(index: number): Promise<number> {
    const size = sizes[index];

    const result = await this.#getColumnClass(size);

    /* istanbul ignore if */
    if (!result && !index) {
      throw Error('No column sizes found.');
    }

    return result || (await this.#getColumnSize(index - 1));
  }

  async #getColumnClass(size: string): Promise<number> {
    const host = await this.host();

    for (let i = 12; i; i--) {
      if (await host.hasClass(`sky-column-${size}-${i}`)) {
        return i;
      }
    }

    return 0;
  }
}
