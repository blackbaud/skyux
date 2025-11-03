import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';
import { SkyStatusIndicatorHarness } from '@skyux/indicators/testing';
import { SkyPopoverHarness } from '@skyux/popovers/testing';

import { SkyCharacterCounterIndicatorHarness } from '../character-counter/character-counter-indicator-harness';
import { SkyFormErrorHarness } from '../form-error/form-error-harness';
import { SkyFormErrorsHarness } from '../form-error/form-errors-harness';

import { SkyInputBoxHarnessFilters } from './input-box-harness-filters';

/**
 * Harness for interacting with an input box component in tests.
 */
export class SkyInputBoxHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-input-box';

  #getHintText = this.locatorForOptional('.sky-input-box-hint-text');
  #getLabel = this.locatorForOptional('.sky-control-label');
  #getWrapper = this.locatorFor('.sky-input-box');

  async #getFormError(): Promise<SkyFormErrorsHarness> {
    return await this.locatorFor(SkyFormErrorsHarness)();
  }

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyInputBoxHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyInputBoxHarnessFilters,
  ): HarnessPredicate<SkyInputBoxHarness> {
    return SkyInputBoxHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    await (await this.#getHelpInline()).click();
  }

  /**
   * Gets the character counter indicator for the input box or throws an error if
   * a character limit is not specified.
   */
  public async getCharacterCounter(): Promise<SkyCharacterCounterIndicatorHarness> {
    const characterCounter = await this.locatorForOptional(
      new HarnessPredicate(SkyCharacterCounterIndicatorHarness, {
        ancestor: '.sky-input-box-label-wrapper',
      }),
    )();

    if (!characterCounter) {
      throw new Error(
        'The input box does not have a character limit specified.',
      );
    }

    return characterCounter;
  }

  /**
   * Gets a list of status indicator harnesses for errors not automatically
   * handled by input box.
   */
  public async getCustomErrors(): Promise<SkyStatusIndicatorHarness[]> {
    const errors = await this.locatorForAll(
      new HarnessPredicate(SkyStatusIndicatorHarness, {
        selector:
          'sky-status-indicator:not(sky-form-error sky-status-indicator)',
      }),
    )();

    return errors;
  }

  /**
   * Gets the custom form error.
   */
  public async getCustomFormError(
    errorName: string,
  ): Promise<SkyFormErrorHarness | null> {
    return await this.locatorFor(
      SkyFormErrorHarness.with({ errorName: errorName }),
    )();
  }

  /**
   * Whether the custom form error is triggered.
   */
  public async hasCustomFormError(errorName: string): Promise<boolean> {
    return await (await this.#getFormError()).hasError(errorName);
  }

  /**
   * Whether the required field is empty.
   */
  public async hasRequiredError(): Promise<boolean> {
    return await (await this.#getFormError()).hasError('required');
  }

  /**
   * Whether the field has more characters than allowed.
   */
  public async hasMaxLengthError(): Promise<boolean> {
    return await (await this.#getFormError()).hasError('maxlength');
  }

  /**
   * Whether the field has fewer characters than allowed.
   */
  public async hasMinLengthError(): Promise<boolean> {
    return await (await this.#getFormError()).hasError('minlength');
  }

  /**
   * Whether the field is set to an invalid email address.
   */
  public async hasEmailError(): Promise<boolean> {
    return await (await this.#getFormError()).hasError('email');
  }

  /**
   * Whether the field is set to an invalid URL.
   */
  public async hasUrlError(): Promise<boolean> {
    return await (await this.#getFormError()).hasError('url');
  }

  /**
   * Whether the field is set to an invalid date.
   */
  public async hasInvalidDateError(): Promise<boolean> {
    return await (await this.#getFormError()).hasError('invalidDate');
  }

  /**
   * Whether the field is set to an invalid minimum date.
   */
  public async hasMinDateError(): Promise<boolean> {
    return await (await this.#getFormError()).hasError('minDate');
  }

  /**
   * Whether the field is set to an invalid maximum date.
   */
  public async hasMaxDateError(): Promise<boolean> {
    return await (await this.#getFormError()).hasError('maxDate');
  }

  /**
   * Whether the field is set to an invalid phone number.
   */
  public async hasPhoneFieldError(): Promise<boolean> {
    return await (await this.#getFormError()).hasError('phone');
  }

  /**
   * Whether the field is set to an invalid time.
   */
  public async hasTimeError(): Promise<boolean> {
    return await (await this.#getFormError()).hasError('time');
  }

  /**
   * Indicates whether the input box has disabled styles applied.
   */
  public async getDisabled(): Promise<boolean> {
    const wrapper = await this.#getWrapper();

    return await wrapper.hasClass('sky-input-box-disabled');
  }

  /**
   * Gets the text for the input box label.
   */
  public async getLabelText(): Promise<string> {
    const label = await this.#getLabel();

    return await this.#getElementTextOrDefault(label);
  }

  /**
   * Gets the help popover for the input box or throws an error if
   * the help popover is not configured.
   */
  public async getHelpPopover(): Promise<SkyPopoverHarness> {
    const helpPopover = await this.locatorForOptional(
      new HarnessPredicate(SkyPopoverHarness, {
        ancestor: '.sky-control-help',
      }),
    )();

    if (!helpPopover) {
      throw new Error('The input box does not have a help popover configured.');
    }

    return helpPopover;
  }

  /**2
   * Gets the help popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  /**
   * Gets the help popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  /**
   * Gets the hint text for the input box.
   */
  public async getHintText(): Promise<string> {
    const hintText = await this.#getHintText();

    return await this.#getElementTextOrDefault(hintText);
  }

  /**
   * Indicates whether the input box has stacked styles applied.
   */
  public async getStacked(): Promise<boolean> {
    const host = await this.host();

    return await host.hasClass('sky-form-field-stacked');
  }

  async #getElementTextOrDefault(el: TestElement | null): Promise<string> {
    return (await el?.text())?.trim() ?? '';
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
