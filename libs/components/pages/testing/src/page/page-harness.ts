import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyPageLayoutType } from '@skyux/pages';

import { SkyPageHarnessFilters } from './page-harness-filters';

const LAYOUT_PREFIX = 'sky-page-layout-';
const LAYOUT_TYPES: SkyPageLayoutType[] = [
  'box',
  'fit',
  'list',
  'split-view',
  'tabs',
];

/**
 * Harness for interacting with a page component in tests.
 */
export class SkyPageHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-page';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyPageHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyPageHarnessFilters
  ): HarnessPredicate<SkyPageHarness> {
    return SkyPageHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the current layout.
   */
  public async getLayout(): Promise<SkyPageLayoutType> {
    const page = await this.host();

    for (const layout of LAYOUT_TYPES) {
      if (await page.hasClass(`${LAYOUT_PREFIX}${layout}`)) {
        return layout;
      }
    }

    return 'auto';
  }
}
