import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyVerticalTabButtonHarness } from './vertical-tab-button-harness';
import { SkyVerticalTabContentHarness } from './vertical-tab-content-harness';
import { SkyVerticalTabsetGroupHarness } from './vertical-tabset-group-harness';
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

  /**
   * Gets an array of `SkyVerticalTabButtonHarness` in this tabset.
   */
  public async getTabs(): Promise<SkyVerticalTabButtonHarness[] | undefined> {
    if (await this.isTabsVisible()) {
      return await this.locatorForAll(SkyVerticalTabButtonHarness)();
    }
    return undefined;
  }

  /**
   * Gets an array of `SkyVerticalTabsetGroupHarness` in this tabset.
   */
  public async getGroups(): Promise<
    SkyVerticalTabsetGroupHarness[] | undefined
  > {
    if (await this.isTabsVisible()) {
      return await this.locatorForAll(SkyVerticalTabsetGroupHarness)();
    }
    return undefined;
  }

  /**
   * Gets the `SkyVerticalTabButtonHarness` of the currently active tab.
   * // todo ask engineers which way we want to go moving forward. throwing an error when consumers try to do something funky. or just don't do anything.
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
   * Gets a `SkyVerticalTabButtonHarness` with a `tabHeading` matching the input.
   */
  public async getTabByHeading(
    tabHeading: string,
  ): Promise<SkyVerticalTabButtonHarness | undefined> {
    return await this.locatorFor(
      SkyVerticalTabButtonHarness.with({ tabHeading: tabHeading }),
    )();
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
   * Click the `Tab list` button in mobile view to show hidden tab list.
   */
  public async clickShowTabsButton(): Promise<void> {
    const showTabsButton = await this.#showTabsButton();
    if (showTabsButton) {
      await showTabsButton.click();
    }
  }
}
