import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownItemHarnessFilters } from './dropdown-item-harness.filters';

/**
 * Harness for interacting with a dropdown item component in tests.
 */
export class SkyDropdownItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown-item';

  #getItem = this.locatorFor('.sky-dropdown-item');
  #getButton = this.locatorFor('button,a');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDropdownItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDropdownItemHarnessFilters,
  ): HarnessPredicate<SkyDropdownItemHarness> {
    return SkyDropdownItemHarness.getDataSkyIdPredicate(filters)
      .addOption('text', filters.text, async (harness, text) => {
        const menuItemText = await harness.getText();
        return await HarnessPredicate.stringMatches(menuItemText, text);
      })
      .addOption('ariaRole', filters.ariaRole, async (harness, ariaRole) => {
        const itemAriaRole = await harness.getAriaRole();
        return await HarnessPredicate.stringMatches(itemAriaRole, ariaRole);
      });
  }

  /**
   * Clicks the dropdown item.
   */
  public async click(): Promise<void> {
    await (await this.#getButton()).click();
  }

  /**
   * Gets the dropdown item role.
   */
  public async getAriaRole(): Promise<string | null> {
    return await (await this.#getItem()).getAttribute('role');
  }

  /**
   * Gets the menu item text.
   */
  public async getText(): Promise<string | null> {
    return await (await this.#getItem()).text();
  }
}
