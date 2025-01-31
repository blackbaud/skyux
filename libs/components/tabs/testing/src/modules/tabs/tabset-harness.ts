import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  SkyDropdownHarness,
  SkyDropdownMenuHarness,
} from '@skyux/popovers/testing';
import { SkyTabsetButtonsDisplayMode } from '@skyux/tabs';

import { SkyTabButtonHarness } from './tab-button-harness';
import { SkyTabContentHarness } from './tab-content-harness';
import { SkyTabsetHarnessFilters } from './tabset-harness-filters';

/**
 * Harness for interacting with a tabset component in tests.
 */
export class SkyTabsetHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tabset';

  #getTabset = this.locatorFor('.sky-tabset');
  #getTabButtons = this.locatorForAll(SkyTabButtonHarness);
  #getTabDropdown = this.locatorFor(SkyDropdownHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTabsetHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTabsetHarnessFilters,
  ): HarnessPredicate<SkyTabsetHarness> {
    return SkyTabsetHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * In `dropdown` mode, clicks the dropdown tab to open the tab dropdown menu.
   */
  public async clickDropdownTab(): Promise<void> {
    if (!((await this.getMode()) === 'dropdown')) {
      throw new Error(
        'Cannot click dropdown tab button, tab is not in dropdown mode.',
      );
    }
    const button = await this.locatorFor(SkyDropdownHarness)();
    return await button.clickDropdownButton();
  }

  /**
   * Clicks the new tab button if visible.
   */
  public async clickNewTabButton(): Promise<void> {
    const newTabButton = await this.locatorForOptional(
      'button.sky-tabset-btn-new',
    )();

    if (!newTabButton) {
      throw new Error('Unable to find the new tab button.');
    }

    return await newTabButton.click();
  }

  /**
   * Clicks the open tab button if visible.
   */
  public async clickOpenTabButton(): Promise<void> {
    const openTabButton = await this.locatorForOptional(
      'button.sky-tabset-btn-open',
    )();

    if (!openTabButton) {
      throw new Error('Unable to find the open tab button.');
    }

    return await openTabButton.click();
  }

  /**
   * Clicks a tab button with a `tabHeading` matching the input.
   */
  public async clickTabButton(tabHeading: string): Promise<void> {
    const tabButton = await this.getTabButtonHarness(tabHeading);
    return await tabButton.click();
  }

  /**
   * Gets the active tab button harness.
   */
  public async getActiveTabButton(): Promise<SkyTabButtonHarness | null> {
    const tabButtonHarnesses = await this.getTabButtonHarnesses();

    for (const harness of tabButtonHarnesses) {
      if (await harness.isActive()) {
        return harness;
      }
    }

    /* istanbul ignore next */
    return null;
  }

  /**
   * Gets the tabset aria-label value.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getTabset()).getAttribute('aria-label');
  }

  /**
   * Gets the tabset aria-labelledby value.
   */
  public async getAriaLabelledBy(): Promise<string | null> {
    return await (await this.#getTabset()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the tabset's display mode.
   */
  public async getMode(): Promise<SkyTabsetButtonsDisplayMode> {
    if (await (await this.#getTabset()).hasClass('sky-tabset-mode-tabs')) {
      return 'tabs';
    }
    return 'dropdown';
  }

  /**
   * Gets a tab button harness with the given `tabHeading`
   */
  public async getTabButtonHarness(
    tabHeading: string,
  ): Promise<SkyTabButtonHarness> {
    if ((await this.getMode()) === 'dropdown') {
      const menu = await this.#getDropdownMenu();
      return await menu.queryHarness(
        SkyTabButtonHarness.with({ tabHeading: tabHeading }),
      );
    }
    return await this.locatorFor(
      SkyTabButtonHarness.with({ tabHeading: tabHeading }),
    )();
  }

  /**
   * Gets an array of all tab button harnesses.
   */
  public async getTabButtonHarnesses(): Promise<SkyTabButtonHarness[]> {
    if ((await this.getMode()) === 'dropdown') {
      const menu = await this.#getDropdownMenu();
      return await menu.queryHarnesses(SkyTabButtonHarness);
    }
    return await this.#getTabButtons();
  }

  /**
   * Gets a tab content harness for the tab with the given `tabHeading`.
   */
  public async getTabContentHarness(
    tabHeading: string,
  ): Promise<SkyTabContentHarness> {
    const tabButton = await this.getTabButtonHarness(tabHeading);
    const id = await tabButton.getTabId();
    return await this.locatorFor(SkyTabContentHarness.with({ tabId: id }))();
  }

  async #getDropdownMenu(): Promise<SkyDropdownMenuHarness> {
    const dropdown = await this.#getTabDropdown();
    if (!(await dropdown?.isOpen())) {
      throw new Error(
        'Cannot get tab button when tabs is in dropdown mode and is closed.',
      );
    }
    return await dropdown.getDropdownMenu();
  }
}
