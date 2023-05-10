import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownItemHarnessFilters } from './dropdown-item-harness.filters';

export class SkyDropdownItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown-item';

  #getItem = this.locatorFor('.sky-dropdown-item');
  #getButton = this.locatorFor('button,a');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyAutocompleteHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDropdownItemHarnessFilters
  ): HarnessPredicate<SkyDropdownItemHarness> {
    // return SkyDropdownItemHarness.getDataSkyIdPredicate(filters);
    return new HarnessPredicate(SkyDropdownItemHarness, filters).addOption(
      'textContent',
      filters.text,
      async (harness, text) =>
        HarnessPredicate.stringMatches(await harness.getText(), text)
    );
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
    return (await this.#getItem()).getAttribute('role');
  }

  /**
   * Gets the menu item text.
   */
  public async getText(): Promise<string | null> {
    return (await this.host()).text();
  }
}
