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
   * Gets a harness for a specific tile content section that meets certain criteria.
   */
  public async getSection(
    filter: SkyTileContentSectionHarnessFilters,
  ): Promise<SkyTileContentSectionHarness> {
    return await this.locatorFor(SkyTileContentSectionHarness.with(filter))();
  }

  /**
   * Gets an array of tile content sections.
   */
  public async getSections(
    filters?: SkyTileContentSectionHarnessFilters,
  ): Promise<SkyTileContentSectionHarness[]> {
    const sections = await this.locatorForAll(
      SkyTileContentSectionHarness.with(filters || {}),
    )();

    if (sections.length === 0 && filters) {
      throw new Error(
        `Unable to find any tile content sections with filter(s): ${JSON.stringify(filters)}`,
      );
    }
    return sections;
  }
}
