import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyDataViewHarnessFilters } from './data-view-harness-filters';

/**
 * Harness to interact with a data manager view component in tests.
 */
export class SkyDataViewHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-data-view';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDataViewHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDataViewHarnessFilters,
  ): HarnessPredicate<SkyDataViewHarness> {
    return SkyDataViewHarness.getDataSkyIdPredicate(filters).addOption(
      'viewId',
      filters.viewId,
      async (harness, viewId) => {
        const harnessViewId = await (
          await harness.host()
        ).getAttribute('data-view-id');
        return await HarnessPredicate.stringMatches(harnessViewId, viewId);
      },
    );
  }
}
