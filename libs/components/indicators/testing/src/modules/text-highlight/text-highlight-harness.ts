import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyTextHighlightHarnessFilters } from './text-highlight-harness-filters';

/**
 * Harness to interact with a text highlight directive in tests.
 */
export class SkyTextHighlightHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '[skyHighlight]';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTextHighlightHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTextHighlightHarnessFilters,
  ): HarnessPredicate<SkyTextHighlightHarness> {
    return SkyTextHighlightHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets an array of all instances of highlighted text.
   */
  public async getHighlights(): Promise<TestElement[]> {
    return await this.locatorForAll('mark.sky-highlight-mark')();
  }
}
