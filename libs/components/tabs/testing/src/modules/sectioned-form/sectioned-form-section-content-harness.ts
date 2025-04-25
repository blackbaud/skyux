import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyVerticalTabContentHarness } from '../vertical-tabset/vertical-tab-content-harness';

import { SkySectionedFormSectionContentHarnessFilters } from './sectioned-form-section-content-harness-filters';

/**
 * Harness for interacting with a vertical tab content in tests.
 */
export class SkySectionedFormSectionContentHarness extends SkyVerticalTabContentHarness {
  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySectionedFormSectionContentHarness` that meets certain criteria.
   */
  public static override with(
    filters: SkySectionedFormSectionContentHarnessFilters,
  ): HarnessPredicate<SkySectionedFormSectionContentHarness> {
    return SkySectionedFormSectionContentHarness.getDataSkyIdPredicate(
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
  // public async getTabId(): Promise<string | null> {
  //   return await super.getTabId();
  // }

  /**
   * Whether the section content is visible.
   */
  public override async isVisible(): Promise<boolean> {
    return await super.isVisible();
  }
}
