import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownHarnessFilters } from './dropdown-harness.filters';

export class SkyDropdownHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown';

  #getDropdown = this.locatorFor('.sky-dropdown');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDropdownHarness` that meets certain criteria
   */
  public static with(
    filters: SkyDropdownHarnessFilters
  ): HarnessPredicate<SkyDropdownHarness> {
    return SkyDropdownHarness.getDataSkyIdPredicate(filters);
  }
}
