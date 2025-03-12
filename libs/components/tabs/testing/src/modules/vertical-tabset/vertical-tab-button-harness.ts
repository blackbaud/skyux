import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyVerticalTabButtonHarnessFilters } from './vertical-tab-button-harness-filters';
import { SkyVerticalTabContentHarness } from './vertical-tab-content-harness';

/**
 * Harness for interacting with a vertical tab in tests.
 */
export class SkyVerticalTabButtonHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-vertical-tab';

  #tabButton = this.locatorFor('a.sky-vertical-tab');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyVerticalTabButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyVerticalTabButtonHarnessFilters,
  ): HarnessPredicate<SkyVerticalTabButtonHarness> {
    return new HarnessPredicate(SkyVerticalTabButtonHarness, filters).addOption(
      'tabHeading',
      filters.tabHeading,
      async (harness, heading) => {
        const tabHeading = await harness.getTabHeading();
        return tabHeading === heading;
      },
    );
  }

  /**
   * Gets the tab heading text.
   */
  public async getTabHeading(): Promise<string> {
    return (
      await (await this.locatorFor('.sky-vertical-tab-heading-value')()).text()
    ).trim();
  }

  /**
   * Whether the tab is active.
   */
  public async isActive(): Promise<boolean> {
    return await (await this.#tabButton()).hasClass('sky-vertical-tab-active');
  }

  /**
   * Whether the tab is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return await (
      await this.#tabButton()
    ).hasClass('sky-vertical-tabset-button-disabled');
  }

  /**
   * Gets the tab header count.
   */
  public async getTabHeaderCount(): Promise<number> {
    const value = (
      await (await this.locatorFor('.sky-vertical-tab-count')()).text()
    ).trim();

    // get value between parentheses
    const rx = /\(([^)]+)\)/;

    return Number(value.match(rx)?.[0]);
  }

  /**
   * Gets the `SkyVerticalTabContentHarness` for this tab.
   */
  public async getTabContent(): Promise<SkyVerticalTabContentHarness> {
    return await this.documentRootLocatorFactory().locatorFor(
      SkyVerticalTabContentHarness.with({ tabId: await this.getTabId() }),
    )();
  }

  /**
   * Clicks the tab button to activate the tab.
   */
  public async click(): Promise<void> {
    return await (await this.#tabButton()).click();
  }

  /**
   * Gets the id of the content controlled by this tab.
   * @internal
   */
  public async getTabId(): Promise<string> {
    return (
      (await (await this.#tabButton()).getProperty('aria-controls')) ||
      /* istanbul ignore next */
      ''
    );
  }
}
