import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyVerticalTabButtonHarness } from './vertical-tab-button-harness';
import { SkyVerticalTabButtonHarnessFilters } from './vertical-tab-button-harness-filters';
import { SkyVerticalTabContentHarness } from './vertical-tab-content-harness';
import { SkyVerticalTabsetGroupHarness } from './vertical-tabset-group-harness';
import { SkyVerticalTabsetGroupHarnessFilters } from './vertical-tabset-group-harness-filters';
import { SkyVerticalTabsetHarnessFilters } from './vertical-tabset-harness-filters';

/**
 * Harness for interacting with the vertical tabset component in tests.
 */
export class SkyVerticalTabsetHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-vertical-tabset';

  #showTabsButton = this.locatorForOptional(
    '.sky-vertical-tabset-content > button.sky-vertical-tabset-show-tabs-btn',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyVerticalTabsetHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyVerticalTabsetHarnessFilters,
  ): HarnessPredicate<SkyVerticalTabsetHarness> {
    return SkyVerticalTabsetHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Click the show tabs button in mobile view.
   */
  public async clickShowTabsButton(): Promise<void> {
    const showTabsButton = await this.#showTabsButton();
    if (showTabsButton) {
      await showTabsButton.click();
    }
  }

  /**
   * Gets the `SkyVerticalTabButtonHarness` of the currently active tab.
   */
  public async getActiveTab(): Promise<
    SkyVerticalTabButtonHarness | undefined
  > {
    const tabs = await this.getTabs();
    if (tabs) {
      for (const tab of tabs) {
        if (await tab.isActive()) {
          return tab;
        }
      }
    }
    return undefined;
  }

  /**
   * Gets the `SkyVerticalTabContentHarness` for the currently active tab.
   */
  public async getActiveTabContent(): Promise<
    SkyVerticalTabContentHarness | undefined
  > {
    // in mobile view tabs are not rendered.
    if (!(await this.isTabsVisible())) {
      const contents = await this.locatorForAll(SkyVerticalTabContentHarness)();
      for (const content of contents) {
        if (await content.isVisible()) {
          return content;
        }
      }
    }

    const activeTab = await this.getActiveTab();
    if (activeTab) {
      return await activeTab.getTabContent();
    }
    return undefined;
  }

  /**
   * Gets the aria-label.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (
      await this.locatorFor('span.sky-vertical-tabset-tablist')()
    ).getAttribute('aria-label');
  }

  /**
   * Gets the aria-labelledby.
   */
  public async getAriaLabelledBy(): Promise<string | null> {
    return await (
      await this.locatorFor('span.sky-vertical-tabset-tablist')()
    ).getAttribute('aria-labelledby');
  }

  /**
   * Get a vertical tabset group that meets certain criteria.
   */
  public async getGroup(
    filters: SkyVerticalTabsetGroupHarnessFilters,
  ): Promise<SkyVerticalTabsetGroupHarness | undefined> {
    return await this.locatorFor(SkyVerticalTabsetGroupHarness.with(filters))();
  }

  /**
   * Gets an array of vertical tabset groups.
   */
  public async getGroups(
    filters?: SkyVerticalTabsetGroupHarnessFilters,
  ): Promise<SkyVerticalTabsetGroupHarness[]> {
    // open tablist if in mobile view
    if (!(await this.isTabsVisible())) {
      await this.clickShowTabsButton();
    }

    return await this.locatorForAll(
      SkyVerticalTabsetGroupHarness.with(filters || {}),
    )();
  }

  /**
   * Gets the text in the show tabs button in mobile view.
   */
  public async getShowTabsText(): Promise<string | undefined> {
    const showTabsButton = await this.#showTabsButton();

    // check if it is in mobile view
    if (showTabsButton) {
      return (await await showTabsButton.text()).trim();
    }

    return undefined;
  }

  /**
   * Gets a `SkyVerticalTabButtonHarness` that matches the filter.
   */
  public async getTab(
    filters: SkyVerticalTabButtonHarnessFilters,
  ): Promise<SkyVerticalTabButtonHarness> {
    return await this.locatorFor(SkyVerticalTabButtonHarness.with(filters))();
  }

  /**
   * Gets an array of vertical tab buttons.
   */
  public async getTabs(
    filters?: SkyVerticalTabButtonHarnessFilters,
  ): Promise<SkyVerticalTabButtonHarness[]> {
    // open tablist if in mobile view
    if (!(await this.isTabsVisible())) {
      await this.clickShowTabsButton();
    }

    return await this.locatorForAll(
      SkyVerticalTabButtonHarness.with(filters || {}),
    )();
  }

  /**
   * Whether the tabs are visible.
   * In mobile view, vertical tabsets collapse to just the content pane
   * with a button to show the tabs.
   */
  public async isTabsVisible(): Promise<boolean> {
    const showTabsButton = await this.#showTabsButton();
    if (showTabsButton) {
      return false;
    }
    return true;
  }
}
