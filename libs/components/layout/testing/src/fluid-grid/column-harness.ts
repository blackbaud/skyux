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
    return this.#getColumnSize(0);
  }

  /**
   * Gets the size of the column in a Small responsive context.
   */
  public async getSmallSize(): Promise<number> {
    return this.#getColumnSize(1);
  }

  /**
   * Gets the size of the column in a Medium responsive context.
   */
  public async getMediumSize(): Promise<number> {
    return this.#getColumnSize(2);
  }

  /**
   * Gets the size of the column in a Large responsive context.
   */
  public async getLargeSize(): Promise<number> {
    return this.#getColumnSize(3);
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

  // eslint-disable-next-line complexity
  async #getColumnClass(size: string): Promise<number> {
    const host = await this.host();

    return (await host.hasClass(`sky-column-${size}-12`))
      ? 12
      : (await host.hasClass(`sky-column-${size}-11`))
        ? 11
        : (await host.hasClass(`sky-column-${size}-10`))
          ? 10
          : (await host.hasClass(`sky-column-${size}-9`))
            ? 9
            : (await host.hasClass(`sky-column-${size}-8`))
              ? 8
              : (await host.hasClass(`sky-column-${size}-7`))
                ? 7
                : (await host.hasClass(`sky-column-${size}-6`))
                  ? 6
                  : (await host.hasClass(`sky-column-${size}-5`))
                    ? 5
                    : (await host.hasClass(`sky-column-${size}-4`))
                      ? 4
                      : (await host.hasClass(`sky-column-${size}-3`))
                        ? 3
                        : (await host.hasClass(`sky-column-${size}-2`))
                          ? 2
                          : (await host.hasClass(`sky-column-${size}-1`))
                            ? 1
                            : 0;
  }
}
