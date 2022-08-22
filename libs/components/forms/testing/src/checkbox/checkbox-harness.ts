import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyCheckboxHarnessFilters } from './checkbox-harness-filters';

/**
 * Harness for interacting with a checkbox component in tests.
 */
export class SkyCheckboxHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-checkbox';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyCheckboxHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyCheckboxHarnessFilters
  ): HarnessPredicate<SkyCheckboxHarness> {
    return SkyCheckboxHarness.getDataSkyIdPredicate(filters);
  }

  public async check(): Promise<void> {
    if (!(await this.isChecked())) {
      // do something
    }
  }

  public async uncheck(): Promise<void> {
    if (await this.isChecked()) {
      // do something
    }
  }

  public async blur(): Promise<void> {}

  public async focus(): Promise<void> {}

  public async isChecked(): Promise<boolean> {}

  public async isDisabled(): Promise<boolean> {}

  public async isFocused(): Promise<boolean> {}
}
