import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  SkyDropdownHarness,
  SkyDropdownMenuHarness,
} from '@skyux/popovers/testing';
import { SkyTabsetButtonsDisplayMode } from '@skyux/tabs';

import { SkyTabButtonHarness } from './tab-button-harness';
import { SkyTabHarness } from './tab-harness';
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

  public async clickNewTabButton(): Promise<void> {
    const newTabButton = await this.locatorForOptional(
      'button.sky-tabset-btn-new',
    )();

    if (!newTabButton) {
      throw new Error('Unable to find the new tab button.');
    }

    return await newTabButton.click();
  }

  public async clickDropdownTab(): Promise<void> {
    if (!((await this.getMode()) === 'dropdown')) {
      throw new Error(
        'Cannot click dropdown tab button, tab is not in dropdown mode.',
      );
    }
    const button = await this.locatorFor(SkyDropdownHarness)();
    return await button.clickDropdownButton();
  }

  public async clickOpenTabButton(): Promise<void> {
    const openTabButton = await this.locatorForOptional(
      'button.sky-tabset-btn-open',
    )();

    if (!openTabButton) {
      throw new Error('Unable to find the open tab button.');
    }

    return await openTabButton.click();
  }

  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getTabset()).getAttribute('aria-label');
  }

  public async getAriaLabelledBy(): Promise<string | null> {
    return await (await this.#getTabset()).getAttribute('aria-labelledby');
  }

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

  public async getTabButtonHarnesses(): Promise<SkyTabButtonHarness[]> {
    if ((await this.getMode()) === 'dropdown') {
      const menu = await this.#getDropdownMenu();
      return await menu.queryHarnesses(SkyTabButtonHarness);
    }
    return await this.#getTabButtons();
  }

  public async getTabHarness(tabHeading: string): Promise<SkyTabHarness> {
    const tabButton = await this.getTabButtonHarness(tabHeading);
    const id = await tabButton.getTabId();
    return await this.locatorFor(SkyTabHarness.with({ tabId: id }))();
  }

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

  public async getMode(): Promise<SkyTabsetButtonsDisplayMode> {
    if (await (await this.#getTabset()).hasClass('sky-tabset-mode-tabs')) {
      return 'tabs';
    }
    return 'dropdown';
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
