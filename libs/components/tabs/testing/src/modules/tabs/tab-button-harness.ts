import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyTabButtonHarnessFilters } from './tab-button-harness-filters';
import { SkyTabHarness } from './tab-harness';

/**
 * Harness for interacting with a tab button component in tests.
 */
export class SkyTabButtonHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tab-button';

  #getTabButton = this.locatorFor('a.sky-btn-tab');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTabButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTabButtonHarnessFilters,
  ): HarnessPredicate<SkyTabButtonHarness> {
    return new HarnessPredicate(SkyTabButtonHarness, filters).addOption(
      'tabHeading',
      filters.tabHeading,
      async (harness, tabHeading) => {
        const harnessTabHeading = await harness.getTabHeading();
        return await HarnessPredicate.stringMatches(
          harnessTabHeading,
          tabHeading,
        );
      },
    );
  }

  public async click(): Promise<void> {
    return await (await this.#getTabButton()).click();
  }

  public async getTabHeading(): Promise<string> {
    return (
      // eslint-disable-next-line @cspell/spellchecker
      (
        await (await this.locatorFor('.sky-tab-heading > span[skyid]')()).text()
      ).trim()
    );
  }

  public async getPermalink(): Promise<string | null> {
    return await (await this.#getTabButton()).getAttribute('href');
  }

  public async isActive(): Promise<boolean> {
    return await (await this.#getTabButton()).hasClass('sky-btn-tab-selected');
  }

  public async isDisabled(): Promise<boolean> {
    return await (await this.#getTabButton()).hasClass('sky-btn-tab-disabled');
  }

  public async getTabHarness(): Promise<SkyTabHarness> {
    return await this.documentRootLocatorFactory().locatorFor(
      SkyTabHarness.with({ tabId: await this.getTabId() }),
    )();
  }

  /**
   * @internal
   */
  public async getTabId(): Promise<string> {
    return (
      (await (await this.#getTabButton()).getAttribute('aria-controls')) ||
      /* istanbul ignore next */
      ''
    );
  }
}
