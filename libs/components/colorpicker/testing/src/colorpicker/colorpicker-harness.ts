import { HarnessPredicate } from '@angular/cdk/testing';
import { TemplateRef } from '@angular/core';
import { SkyComponentHarness } from '@skyux/core/testing';
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
  #getButton = this.locatorFor('button.sky-colorpicker-button');
  #resetButtonDefault = this.locatorForOptional(
    'button.sky-colorpicker-reset-button',
  );
  #resetButtonModern = this.locatorForOptional(
    'button.sky-colorpicker-reset-button-modern',
  );

  async #getFormErrors(): Promise<SkyFormErrorsHarness> {
    return await this.locatorFor(SkyFormErrorsHarness)();
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
    return (await this.#getFormErrors())?.hasError('required');
  }

  public async getAriaLabel(): Promise<string | null> {
    return (await this.#getButton()).getAttribute('aria-label');
  }

  public async getTitle(): Promise<string | null> {
    return (await this.#getButton()).getAttribute('title');
  }

  public async isLabelHidden(): Promise<boolean> {
    return (await this.#getLabel()).hasClass('sky-screen-reader-only');
  }

  public async clickColorpickerButton(): Promise<void> {
    (await this.#getButton()).click();
  }

  public async colorpickerIsOpen(): Promise<boolean> {
    return (
      (await (await this.#getButton()).getAttribute('aria-expanded')) === 'true'
    );
  }

  public async clickResetButton(): Promise<void> {
    const defaultButton = (await this.#resetButtonDefault()) ?? null;
    const modernButton = (await this.#resetButtonModern()) ?? null;

    if (!defaultButton && !modernButton) {
      throw Error('No reset button found.');
    }
    if (defaultButton) {
      await defaultButton?.click();
    } else if (modernButton) {
      await modernButton?.click();
    }
  }
}
