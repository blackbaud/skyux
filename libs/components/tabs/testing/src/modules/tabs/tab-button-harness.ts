import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyTabButtonHarnessFilters } from './tab-button-harness-filters';
import { SkyTabContentHarness } from './tab-content-harness';

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
    return SkyTabButtonHarness.getDataSkyIdPredicate(filters).addOption(
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

  /**
   * Clicks the tab button.
   */
  public async click(): Promise<void> {
    return await (await this.#getTabButton()).click();
  }

  /**
   * Clicks the remove tab button if it is visible.
   */
  public async clickRemoveButton(): Promise<void> {
    if (await this.isInWizardTabset()) {
      throw new Error('Cannot use remove tab button in a wizard tabset.');
    }
    const button = await this.locatorForOptional('.sky-btn-tab-close')();
    if (!button) {
      throw new Error('Unable to find remove tab button.');
    }
    return await button.click();
  }

  /**
   * Gets the permalink that the page routes to when the tab is clicked.
   */
  public async getPermalink(): Promise<string | null> {
    if (await this.isInWizardTabset()) {
      throw new Error(
        'Cannot get permalink for tab button in a wizard tabset.',
      );
    }
    return await (await this.#getTabButton()).getAttribute('href');
  }

  /**
   * Gets the `SkyTabContentHarness` controlled by this tab button.
   */
  public async getTabContentHarness(): Promise<SkyTabContentHarness> {
    return await this.documentRootLocatorFactory().locatorFor(
      SkyTabContentHarness.with({ tabId: await this.getTabId() }),
    )();
  }

  /**
   * Gets the tab heading.
   */
  public async getTabHeading(): Promise<string> {
    return (
      // eslint-disable-next-line @cspell/spellchecker
      await (await this.locatorFor('.sky-tab-heading > span[skyid]')()).text()
    );
  }

  /**
   * Gets whether the tab button is active.
   */
  public async isActive(): Promise<boolean> {
    return await (await this.#getTabButton()).hasClass('sky-btn-tab-selected');
  }

  /**
   * Gets whether the tab button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return await (await this.#getTabButton()).hasClass('sky-btn-tab-disabled');
  }

  /**
   * Whether the tab button is in a Wizard tabset.
   */
  public async isInWizardTabset(): Promise<boolean> {
    return await (await this.#getTabButton()).hasClass('sky-btn-tab-wizard');
  }

  /**
   * Gets the id of the content controlled by this tab.
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
