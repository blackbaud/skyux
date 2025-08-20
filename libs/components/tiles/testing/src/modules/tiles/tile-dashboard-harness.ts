import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyTileDashboardHarnessFilters } from './tile-dashboard-harness-filters';
import { SkyTileHarness } from './tile-harness';
import { SkyTileHarnessFilters } from './tile-harness-filters';

/**
 * Harness to interact with a tile dashboard component in tests.
 */
export class SkyTileDashboardHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tile-dashboard';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTileDashboardHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTileDashboardHarnessFilters,
  ): HarnessPredicate<SkyTileDashboardHarness> {
    return SkyTileDashboardHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a harness for a specific tile  that meets certain criteria.
   */
  public async getTile(filter: SkyTileHarnessFilters): Promise<SkyTileHarness> {
    return await this.locatorFor(SkyTileHarness.with(filter))();
  }

  /**
   * Gets an array of tiles.
   */
  public async getTiles(
    filters?: SkyTileHarnessFilters,
  ): Promise<SkyTileHarness[]> {
    const tiles = await this.locatorForAll(
      SkyTileHarness.with(filters || {}),
    )();

    if (tiles.length === 0 && filters) {
      throw new Error(
        `Unable to find any tiles with filter(s): ${JSON.stringify(filters)}`,
      );
    }
    return tiles;
  }

  /**
   * Whether or not the dashboard is in multi-column mode.
   */
  public async isMultiColumn(): Promise<boolean> {
    const host = await this.host();

    return await host.hasClass('sky-tile-dashboard-multi-column');
  }
}
