import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyInlineFormHarnessFilters } from './inline-form-harness.filters';

/**
 * Harness to interact with inline form components in tests.
 */
export class SkyInlineFormHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-inline-form';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyInlineFormHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyInlineFormHarnessFilters,
  ): HarnessPredicate<SkyInlineFormHarness> {
    return SkyInlineFormHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Whether the inline form is shown.
   */
  public async isFormExpanded(): Promise<boolean> {
    return (
      (await (await this.host()).getAttribute('data-show-form')) === 'true'
    );
  }
}
