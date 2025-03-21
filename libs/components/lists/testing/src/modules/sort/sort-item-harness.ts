import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyDropdownItemHarness } from '@skyux/popovers/testing';

import { SkySortItemHarnessFilters } from './sort-item-harness-filters';

/**
 * Harness for interacting with a sort item component in tests.
 */
export class SkySortItemHarness extends SkyDropdownItemHarness {
  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySortItemHarness` that meets certain criteria.
   */
  public static override with(
    filters: SkySortItemHarnessFilters,
  ): HarnessPredicate<SkySortItemHarness> {
    return new HarnessPredicate(this, filters).addOption(
      'text',
      filters.text,
      async (harness, text) => {
        const menuItemText = await harness.getText();
        return await HarnessPredicate.stringMatches(menuItemText, text);
      },
    );
  }

  /**
   * Clicks the sort item.
   */
  public override async click(): Promise<void> {
    await super.click();
  }

  /**
   * Gets the sort item role.
   * This can't be set on sort items and should not be exposed.
   * @internal
   */
  public override async getAriaRole(): Promise<string | null> {
    return await super.getAriaRole();
  }

  /**
   * Gets the sort item text.
   */
  public override async getText(): Promise<string | null> {
    return await super.getText();
  }

  /**
   * Whether the sort item is active.
   */
  public async isActive(): Promise<boolean> {
    return await (
      await this.locatorFor('.sky-sort-item')()
    ).hasClass('sky-sort-item-selected');
  }
}
