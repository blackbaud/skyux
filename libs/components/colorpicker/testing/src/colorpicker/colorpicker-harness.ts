import { HarnessPredicate } from '@angular/cdk/testing';
import { TemplateRef } from '@angular/core';
import { SkyComponentHarness, SkyOverlayHarness } from '@skyux/core/testing';
import { SkyFormErrorsHarness } from '@skyux/forms/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyColorpickerHarnessFilters } from './colorpicker-harness.filters';

export class SkyColorpickerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-colorpicker';

  #getHintText = this.locatorFor('.sky-colorpicker-hint-text');
  #getLabel = this.locatorFor('label.sky-control-label');

  async #getFormErrors(): Promise<SkyFormErrorsHarness> {
    const harness = await this.locatorForOptional(SkyFormErrorsHarness)();

    if (harness) {
      return harness;
    }

    throw Error('no errors found.');
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyColorpickerHarness` that meets certain criteria
   */
  public static with(
    filters: SkyColorpickerHarnessFilters,
  ): HarnessPredicate<SkyColorpickerHarness> {
    return SkyColorpickerHarness.getDataSkyIdPredicate(filters);
  }

  public async clickHelpInline(): Promise<void> {
    return (await this.#getHelpInline()).click();
  }

  public async getHelpPopoverContent(): Promise<
    TemplateRef<unknown> | string | undefined
  > {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  public async getHintText(): Promise<string> {
    return (await (await this.#getHintText()).text()).trim();
  }

  public async getLabelText(): Promise<string> {
    return (await (await this.#getLabel()).text()).trim();
  }

  public async hasRequiredError(): Promise<boolean> {
    return (await this.#getFormErrors()).hasError('required');
  }
}
