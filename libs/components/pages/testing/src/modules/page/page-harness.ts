import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyPageLayoutType } from '@skyux/pages';

import { SkyPageHeaderHarness } from '../page-header/page-header-harness';
import { SkyPageHeaderHarnessFilters } from '../page-header/page-header-harness-filters';

import { SkyPageHarnessFilters } from './page-harness-filters';

const LAYOUT_PREFIX = 'sky-layout-host-';
const LAYOUT_TYPES: SkyPageLayoutType[] = ['blocks', 'fit', 'list', 'tabs'];

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
    filters: SkyPageHarnessFilters,
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

    return 'none';
  }

  /**
   * Gets the first page header that matches the given filters.
   * @param filters filters for which page header to return
   */
  public async getPageHeader(
    filters?: SkyPageHeaderHarnessFilters,
  ): Promise<SkyPageHeaderHarness> {
    const pageHeader = await this.locatorForOptional(
      SkyPageHeaderHarness.with(filters || {}),
    )();
    if (pageHeader) {
      return pageHeader;
    }

    throw new Error(
      `Unable to find a page header with filter(s): ${JSON.stringify(
        filters,
      )}.`,
    );
  }
}
