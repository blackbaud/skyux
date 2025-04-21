import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyTabsetNavButtonType } from '@skyux/tabs';

import { SkyTabsetNavButtonHarnessFilters } from './tabset-nav-button-harness-filters';

/**
 * Harness to interact with tab content nav buttons in wizard components in tests.
 */
export class SkyTabsetNavButtonHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tabset-nav-button';

  #button = this.locatorFor('button');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyWizardTabsetNavButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTabsetNavButtonHarnessFilters,
  ): HarnessPredicate<SkyTabsetNavButtonHarness> {
    return SkyTabsetNavButtonHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the button text.
   */
  public async getButtonText(): Promise<string> {
    return await (await this.#button()).text();
  }

  /**
   * Gets the button type.
   */
  public async getButtonType(): Promise<SkyTabsetNavButtonType | null> {
    return (await (
      await this.host()
    ).getAttribute('buttontype')) as SkyTabsetNavButtonType;
  }

  /**
   * Whether the button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return (await (await this.#button()).getAttribute('disabled')) !== null;
  }
}
