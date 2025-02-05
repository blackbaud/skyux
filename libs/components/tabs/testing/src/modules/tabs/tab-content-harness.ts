import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyTabContentHarnessFilters } from './tab-content-harness-filters';

/**
 * Harness for interacting with a tab component in tests.
 */
export class SkyTabContentHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tab';

  #getTab = this.locatorFor('.sky-tab');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTabContentHarness` that meets certain criteria.
   * @internal
   */
  public static with(
    filters: SkyTabContentHarnessFilters,
  ): HarnessPredicate<SkyTabContentHarness> {
    return new HarnessPredicate(SkyTabContentHarness, filters).addOption(
      'tabId',
      filters.tabId,
      async (harness, tabId) => {
        const harnessId = await harness.getTabId();
        return await HarnessPredicate.stringMatches(harnessId, tabId);
      },
    );
  }

  /**
   * Gets the tab's layout.
   */
  public async getLayout(): Promise<string> {
    return (await (await this.host()).getAttribute('layout')) || 'none';
  }

  /**
   * @internal
   */
  public async getTabId(): Promise<string | null> {
    return await (await this.#getTab()).getAttribute('id');
  }

  /**
   * Whether the tab content is visible.
   */
  public async isVisible(): Promise<boolean> {
    return !(await (await this.#getTab()).getProperty<boolean>('hidden'));
  }
}
