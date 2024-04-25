import { HarnessPredicate } from '@angular/cdk/testing';
import { TemplateRef } from '@angular/core';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

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
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    (await this.#getHelpInline()).click();
  }

  /**
   * Gets an array of harnesses for the checkboxes in the checkbox group.
   */
  public async getCheckboxes(): Promise<SkyCheckboxHarness[]> {
    return await this.#getCheckboxes();
  }

  /**
   * Gets the help popover content.
   */
  public async getHelpPopoverContent(): Promise<
    TemplateRef<unknown> | string | undefined
  > {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  /**
   * Gets the help popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  /**
   * Gets the checkbox group's label text. If `labelHidden` is true,
   * the text will still be returned.
   */
  public async getLabelText(): Promise<string | undefined> {
    return (await this.#getLabel()).text();
  }

  /**
   * Whether the label is hidden.
   */
  public async getLabelHidden(): Promise<boolean> {
    return (await this.#getLabel()).hasClass('sky-screen-reader-only');
  }

  /**
   * Whether the checkbox group has errors.
   */
  public async hasError(errorName: string): Promise<boolean> {
    return (await this.#getFormErrors()).hasError(errorName);
  }

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

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(
      SkyHelpInlineHarness.with({
        ancestor: '.sky-checkbox-group > .sky-control-label',
      }),
    )();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
