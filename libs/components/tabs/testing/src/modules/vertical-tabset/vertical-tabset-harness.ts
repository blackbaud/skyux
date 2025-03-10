import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyVerticalTabsetHarnessFilters } from './vertical-tabset-harness-filters';

/**
 * Harness for interacting with the vertical tabset component in tests.
 */
export class SkyVerticalTabsetHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-vertical-tabset';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyVerticalTabsetHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyVerticalTabsetHarnessFilters,
  ): HarnessPredicate<SkyVerticalTabsetHarness> {
    return new HarnessPredicate(SkyVerticalTabsetHarness, filters);
  }

  /**
   * Gets the currently active tab.
   */
  public async getActiveTab(): Promise<string> {
    const activeTab = await this.locatorFor('.sky-vertical-tab-active')();
    return await activeTab.text();
  }

  /**
   * Selects a tab by its label.
   */
  public async selectTab(label: string): Promise<void> {
    const tab = await this.locatorFor(
      `.sky-vertical-tab:contains("${label}")`,
    )();
    await tab.click();
  }
}
