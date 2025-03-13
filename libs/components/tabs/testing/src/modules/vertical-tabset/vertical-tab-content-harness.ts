import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyVerticalTabContentHarnessFilters } from './vertical-tab-content-harness-filters';

/**
 * Harness for interacting with a vertical tab content in tests.
 */
export class SkyVerticalTabContentHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-vertical-tab-content-pane';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyVerticalTabContentHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyVerticalTabContentHarnessFilters,
  ): HarnessPredicate<SkyVerticalTabContentHarness> {
    return SkyVerticalTabContentHarness.getDataSkyIdPredicate(
      filters,
    ).addOption('tabId', filters.tabId, async (harness, tabId) => {
      const harnessId = await harness.getTabId();
      return await HarnessPredicate.stringMatches(harnessId, tabId);
    });
  }

  /**
   * Gets the tab content's id.
   * @internal
   */
  public async getTabId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id');
  }

  /**
   * Whether the tab content is visible.
   */
  public async isVisible(): Promise<boolean> {
    return !(await (await this.host()).hasClass('sky-vertical-tab-hidden'));
  }
}
