import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyFormErrorsHarness } from '@skyux/forms/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';
import { SkyIconHarness } from '@skyux/icon/testing';

import { SkyColorpickerDropdownHarness } from './colorpicker-dropdown-harness';
import { SkyColorpickerHarnessFilters } from './colorpicker-harness.filters';

/**
 * Harness for interacting with colorpicker components in tests.
 */
export class SkyColorpickerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-colorpicker';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getButton = this.locatorFor('button.sky-colorpicker-button');
  #getHintText = this.locatorFor('.sky-colorpicker-hint-text');
  #getLabel = this.locatorFor('label.sky-control-label');
  #resetButtonDefault = this.locatorForOptional(
    'button.sky-colorpicker-reset-button',
  );
  #resetButtonModern = this.locatorForOptional(
    'button.sky-colorpicker-reset-button-modern',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyColorpickerHarness` that meets certain criteria
   */
  public static with(
    filters: SkyColorpickerHarnessFilters,
  ): HarnessPredicate<SkyColorpickerHarness> {
    return SkyColorpickerHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the colorpicker button.
   */
  public async clickColorpickerButton(): Promise<void> {
    const button = await this.#getButton();
    return await button.click();
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    await (await this.#getHelpInline()).click();
  }

  /**
   * Clicks the reset button. Throws an error if the reset button is hidden.
   */
  public async clickResetButton(): Promise<void> {
    const defaultButton = (await this.#resetButtonDefault()) ?? null;
    const modernButton = (await this.#resetButtonModern()) ?? null;

    if (!defaultButton && !modernButton) {
      throw new Error('No reset button found.');
    }
    if (defaultButton) {
      return await defaultButton?.click();
    } else if (modernButton) {
      return await modernButton?.click();
    }
  }

  /**
   * Gets the colorpicker button's `aria-label`.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getButton()).getAttribute('aria-label');
  }

  /**
   * Gets the colorpicker button's `aria-labelledby`
   */
  public async getAriaLabelledby(): Promise<string | null> {
    return await (await this.#getButton()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the `SkyColorpickerDropdownHarness` for the colorpicker dropdown controlled by
   * the colorpicker button. Throws an error if the dropdown is not open.
   */
  public async getColorpickerDropdown(): Promise<SkyColorpickerDropdownHarness> {
    const overlayId = await this.#getOverlayId();

    if (!overlayId) {
      throw new Error(
        'Unable to get colorpicker dropdown because dropdown is closed',
      );
    }

    return await this.#documentRootLocator.locatorFor(
      SkyColorpickerDropdownHarness.with({ selector: `#${overlayId}` }),
    )();
  }

  /**
   * Gets the `SkyIconHarness` for the colorpicker icon.
   * @internal
   */
  public async getColorpickerIcon(): Promise<SkyIconHarness> {
    return await this.locatorFor(SkyIconHarness)();
  }

  /**
   * Gets the help inline popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  /**
   * Gets the help inline popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  /**
   * Gets the colorpicker component's hint text.
   */
  public async getHintText(): Promise<string> {
    return (await (await this.#getHintText()).text()).trim();
  }

  /**
   * Whether the colorpicker component's label is hidden.
   */
  public async getLabelHidden(): Promise<boolean> {
    return await (await this.#getLabel()).hasClass('sky-screen-reader-only');
  }

  /**
   * Gets the colorpicker component's label text.
   */
  public async getLabelText(): Promise<string> {
    return (await (await this.#getLabel()).text()).trim();
  }

  /**
   * Whether the custom error has fired.
   * @param errorName `errorName` of the custom error.
   */
  public async hasError(errorName: string): Promise<boolean> {
    return await (await this.#getFormErrors())?.hasError(errorName);
  }

  /**
   * Whether the required error has fired.
   */
  public async hasRequiredError(): Promise<boolean> {
    return await (await this.#getFormErrors())?.hasError('required');
  }

  /**
   * Whether the reset button is shown.
   */
  public async hasResetButton(): Promise<boolean> {
    const defaultButton = (await this.#resetButtonDefault()) ?? null;
    const modernButton = (await this.#resetButtonModern()) ?? null;

    return !!defaultButton || !!modernButton;
  }

  /**
   * Whether the colorpicker component is open.
   */
  public async isColorpickerOpen(): Promise<boolean> {
    try {
      await this.getColorpickerDropdown();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Whether the colorpicker component is stacked.
   */
  public async isStacked(): Promise<boolean> {
    return await (await this.host()).hasClass('sky-form-field-stacked');
  }

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

  async #getOverlayId(): Promise<string | null> {
    return await (await this.#getButton()).getAttribute('aria-controls');
  }
}
