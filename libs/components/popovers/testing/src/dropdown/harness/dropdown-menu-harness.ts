import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDropdownHarness } from './dropdown-harness';
import { SkyDropdownMenuHarnessFilters } from './dropdown-menu-harness.filters';

/**
 * Harness for interacting with dropdown menu in tests
 */
export class SkyDropdownMenuHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown-menu';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDropdownMenuHarness` that meets certain criteria
   */
  public static with(
    filters: SkyDropdownMenuHarnessFilters
  ): HarnessPredicate<SkyDropdownMenuHarness> {
    return SkyDropdownHarness.getDataSkyIdPredicate(filters);
  }
}
