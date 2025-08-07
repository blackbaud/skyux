import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyVerticalTabContentHarness } from '../vertical-tabset/vertical-tab-content-harness';

import { SkySectionedFormSectionContentHarnessFilters } from './sectioned-form-section-content-harness-filters';

/**
 * Harness for interacting with a sectioned form content in tests.
 */
export class SkySectionedFormSectionContentHarness extends SkyVerticalTabContentHarness {
  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySectionedFormSectionContentHarness` that meets certain criteria.
   */
  public static override with(
    filters: SkySectionedFormSectionContentHarnessFilters,
  ): HarnessPredicate<SkySectionedFormSectionContentHarness> {
    return super.with(
      filters,
    ) as HarnessPredicate<SkySectionedFormSectionContentHarness>;
  }

  /**
   * Whether the section content is visible.
   */
  public override async isVisible(): Promise<boolean> {
    return await super.isVisible();
  }
}
