import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyTileContentSectionHarness } from './tile-content-section-harness';
import { SkyTileContentSectionHarnessFilters } from './tile-content-section-harness-filters';

/**
 * Harness to interact with a tile content component in tests.
 */
export class SkyTileContentHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tile-content';

  /**
   * Gets a specific tile content section based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getSection(
    filter: SkyTileContentSectionHarnessFilters,
  ): Promise<SkyTileContentSectionHarness> {
    return await this.locatorFor(SkyTileContentSectionHarness.with(filter))();
  }

  /**
   * Gets an array of tile content sections based on the filter criteria.
   * If no filter is provided, returns all tile content sections.
   * @param filters The optional filter criteria.
   */
  public async getSections(
    filters?: SkyTileContentSectionHarnessFilters,
  ): Promise<SkyTileContentSectionHarness[]> {
    return await this.locatorForAll(
      SkyTileContentSectionHarness.with(filters || {}),
    )();
  }
}
