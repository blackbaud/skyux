import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyVerticalTabButtonHarness } from './vertical-tab-button-harness';
import { SkyVerticalTabButtonHarnessFilters } from './vertical-tab-button-harness-filters';
import { SkyVerticalTabsetGroupHarnessFilters } from './vertical-tabset-group-harness-filters';

/**
 * Harness for interacting with a vertical tabset group in tests.
 */
export class SkyVerticalTabsetGroupHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-vertical-tabset-group';

  #button = this.locatorFor('button.sky-vertical-tabset-button');
  #header = this.locatorFor('.sky-vertical-tabset-group-header');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyVerticalTabsetGroupHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyVerticalTabsetGroupHarnessFilters,
  ): HarnessPredicate<SkyVerticalTabsetGroupHarness> {
    return new HarnessPredicate(
      SkyVerticalTabsetGroupHarness,
      filters,
    ).addOption(
      'groupHeading',
      filters.groupHeading,
      async (harness, heading) => {
        return (await harness.getGroupHeading()) === heading;
      },
    );
  }

  /**
   * Clicks the group button to toggle its expanded state.
   */
  public async click(): Promise<void> {
    return await (await this.#button()).click();
  }

  /**
   * Gets the group heading text.
   */
  public async getGroupHeading(): Promise<string> {
    return (await (await this.#button()).text()).trim();
  }

  /**
   * Gets a specific tab under this group that matches certain criteria.
   */
  public async getVerticalTab(
    filters: SkyVerticalTabButtonHarnessFilters,
  ): Promise<SkyVerticalTabButtonHarness> {
    return await this.locatorFor(SkyVerticalTabButtonHarness.with(filters))();
  }

  /**
   * Gets an array of vertical tab buttons under this group.
   */
  public async getVerticalTabs(
    filters?: SkyVerticalTabButtonHarnessFilters,
  ): Promise<SkyVerticalTabButtonHarness[]> {
    return await this.locatorForAll(
      SkyVerticalTabButtonHarness.with(filters || {}),
    )();
  }

  /**
   * Whether a tab under this group is active.
   */
  public async isActive(): Promise<boolean> {
    return await (
      await this.#header()
    ).hasClass('sky-vertical-tabset-group-header-active');
  }

  /**
   * Whether the group is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return await (
      await this.#button()
    ).hasClass('sky-vertical-tabset-button-disabled');
  }

  /**
   * Whether the group is expanded.
   */
  public async isOpen(): Promise<boolean> {
    return (
      (await (await this.#button()).getAttribute('aria-expanded')) === 'true'
    );
  }
}
