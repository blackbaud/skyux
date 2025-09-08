import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyIllustrationSize } from '@skyux/indicators';

import { SkyIllustrationHarnessFilters } from './illustration-harness-filters';

/**
 * Harness for interacting with an illustration component in tests.
 */
export class SkyIllustrationHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-illustration';

  #getIllustrationWrapper = this.locatorFor('.sky-illustration-wrapper');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyIllustrationHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyIllustrationHarnessFilters,
  ): HarnessPredicate<SkyIllustrationHarness> {
    return SkyIllustrationHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the specified name of the illustration.
   */
  public async getName(): Promise<string> {
    const wrapper = await this.#getIllustrationWrapper();
    const name = await wrapper.getAttribute('data-sky-illustration-name');

    if (name === null) {
      throw new Error('Name was not set.');
    }

    return name;
  }

  /**
   * Gets the specified size of the illustration.
   */
  public async getSize(): Promise<SkyIllustrationSize> {
    const wrapper = await this.#getIllustrationWrapper();

    let foundSize;

    for (const size of ['sm', 'md', 'lg', 'xl']) {
      if (await wrapper.hasClass(`sky-illustration-${size}`)) {
        foundSize = size as SkyIllustrationSize;
      }
    }

    if (foundSize) {
      return foundSize;
    }

    throw new Error('Size was not set.');
  }
}
