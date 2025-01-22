import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyTabsetButtonsDisplayMode } from '@skyux/tabs';

import { SkyTabButtonHarness } from './tab-button-harness';

/**
 * Harness for interacting with a tabset component in tests.
 */
export class SkyTabsetHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tabset';

  #getTabset = this.locatorFor('.sky-tabset');
  #getTabs = this.locatorForAll(SkyTabButtonHarness);

  public async clickNewTabButton(): Promise<void> {
    const newTabButton = await this.locatorForOptional(
      'button.sky-tabset-btn-new',
    )();

    if (!newTabButton) {
      throw new Error('Unable to find the new tab button.');
    }

    return await newTabButton.click();
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

  public async getPermalinkId(): Promise<string | null> {
    return await (await this.host()).getAttribute('permalinkId');
  }

  public async getTabButtonHarness(
    tabHeading: string,
  ): Promise<SkyTabButtonHarness> {
    return await this.locatorFor(
      SkyTabButtonHarness.with({ tabHeading: tabHeading }),
    )();
  }

  public async getTabButtonHarnesses(): Promise<SkyTabButtonHarness[]> {
    return await this.#getTabs();
  }

  public async getActiveTabButton(): Promise<SkyTabButtonHarness | null> {
    const tabButtonHarnesses = await this.getTabButtonHarnesses();

    for (const harness of tabButtonHarnesses) {
      if (await harness.isActive()) {
        return harness;
      }
    }

    return null;
  }

  public async getMode(): Promise<SkyTabsetButtonsDisplayMode> {
    if (await (await this.#getTabset()).hasClass('sky-tabset-mode-tabs')) {
      return 'tabs';
    }
    return 'dropdown';
  }
}
