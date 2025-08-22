import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyInlineFormButtonHarness } from './inline-form-button-harness';
import { SkyInlineFormButtonHarnessFilters } from './inline-form-button-harness.filters';
import { SkyInlineFormHarnessFilters } from './inline-form-harness.filters';
import { SkyInlineFormTemplateHarness } from './inline-form-template-harness';

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
   * Gets an inline form button that matches the given filters.
   */
  public async getButton(
    filters: SkyInlineFormButtonHarnessFilters,
  ): Promise<SkyInlineFormButtonHarness | null> {
    if (!(await this.isFormExpanded())) {
      throw new Error(
        'Inline form is not expanded. The buttons cannot be retrieved when not visible.',
      );
    }
    return await this.locatorFor(SkyInlineFormButtonHarness.with(filters))();
  }

  /**
   * Gets the inline form's buttons.
   */
  public async getButtons(
    filters?: SkyInlineFormButtonHarnessFilters,
  ): Promise<SkyInlineFormButtonHarness[]> {
    if (!(await this.isFormExpanded())) {
      throw new Error(
        'Inline form is not expanded. The buttons cannot be retrieved when not visible.',
      );
    }
    return await this.locatorForAll(
      SkyInlineFormButtonHarness.with(filters || {}),
    )();
  }

  /**
   * Returns a harness wrapping the inline form's template when expanded.
   */
  public async getTemplate(): Promise<SkyInlineFormTemplateHarness> {
    if (!(await this.isFormExpanded())) {
      throw new Error(
        'Inline form is not expanded. Cannot retrieve template when not visible.',
      );
    }

    return await this.locatorFor(SkyInlineFormTemplateHarness)();
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
