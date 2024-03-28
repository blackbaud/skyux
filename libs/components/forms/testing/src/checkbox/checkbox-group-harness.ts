import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFormErrorsHarness } from '../form-error/form-errors-harness';

import { SkyCheckboxGroupHarnessFilters } from './checkbox-group-harness-filters';
import { SkyCheckboxHarness } from './checkbox-harness';

/**
 * Harness for interacting with a checkbox group component in tests.
 * @internal
 */
export class SkyCheckboxGroupHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-checkbox-group';

  #getCheckboxes = this.locatorForAll(SkyCheckboxHarness);

  #getLabel = this.locatorFor('.sky-control-label');

  async #getFormErrors(): Promise<SkyFormErrorsHarness> {
    const harness = await this.locatorForOptional(
      SkyFormErrorsHarness.with({
        dataSkyId: 'checkbox-group-form-errors',
      }),
    )();

    if (harness) {
      return harness;
    }

    throw Error('No form errors found.');
  }

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyCheckboxGroupHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyCheckboxGroupHarnessFilters,
  ): HarnessPredicate<SkyCheckboxGroupHarness> {
    return SkyCheckboxGroupHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the checkbox's label text. If the label is set via `labelText` and `labelHidden` is true,
   * the text will still be returned.
   */
  public async getLabelText(): Promise<string | undefined> {
    return (await this.#getLabel()).text();
  }

  /**
   * Whether the label is hidden. Only supported when using the `labelText` input to set the label.
   */
  public async getLabelHidden(): Promise<boolean> {
    return (await this.#getLabel()).hasClass('sky-screen-reader-only');
  }

  public async getCheckboxes(): Promise<SkyCheckboxHarness[]> {
    return await this.#getCheckboxes();
  }

  public async hasError(errorName: string): Promise<boolean> {
    return (await this.#getFormErrors()).hasError(errorName);
  }
}
