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

  #getImage = this.locatorFor('.sky-illustration-img');

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
    const img = await this.#getImage();
    const name = await img.getAttribute('data-sky-illustration-name');

    if (name === null) {
      throw new Error('Name was not set.');
    }

    return name;
  }

  /**
   * Gets the specified size of the illustration.
   */
  public async getSize(): Promise<SkyIllustrationSize> {
    const img = await this.#getImage();
    const height = await img.getAttribute('height');
    const width = await img.getAttribute('width');

    if (height !== width) {
      throw new Error('The image height and width do not match.');
    }

    switch (height) {
      case '0':
        throw new Error('Size was not set.');
      case '48':
        return 'sm';
      case '64':
        return 'md';
      case '80':
        return 'lg';
      case '96':
        return 'xl';
    }

    throw new Error(
      'The image dimensions do not match the specified illustration size.',
    );
  }
}
