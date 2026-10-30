import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyCodeHarnessFilters } from './code-harness-filters';

/**
 * Harness for interacting with a code component in tests.
 */
export class SkyCodeHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-code';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyCodeHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyCodeHarnessFilters,
  ): HarnessPredicate<SkyCodeHarness> {
    return SkyCodeHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the text of the code token.
   */
  public async getText(): Promise<string> {
    return await (await this.host()).text();
  }
}
