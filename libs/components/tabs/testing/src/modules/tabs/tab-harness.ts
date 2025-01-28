import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyTabHarnessFilters } from './tab-harness-filters';

/**
 * Harness for interacting with a tab component in tests.
 */
export class SkyTabHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tab';

  #getTab = this.locatorFor('.sky-tab');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTabHarness` that meets certain criteria.
   * @internal
   */
  public static with(
    filters: SkyTabHarnessFilters,
  ): HarnessPredicate<SkyTabHarness> {
    return new HarnessPredicate(SkyTabHarness, filters).addOption(
      'tabId',
      filters.tabId,
      async (harness, tabId) => {
        const harnessId = await harness.getTabId();
        return await HarnessPredicate.stringMatches(harnessId, tabId);
      },
    );
  }

  public async getLayout(): Promise<string> {
    return (await (await this.host()).getAttribute('layout')) || 'none';
  }

  /**
   * @internal
   */
  public async getTabId(): Promise<string | null> {
    return await (await this.#getTab()).getAttribute('id');
  }

  public async isVisible(): Promise<boolean> {
    return !(await (await this.#getTab()).getProperty<boolean>('hidden'));
  }
}
