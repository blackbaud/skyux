import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
  TestElement,
} from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyStatusIndicatorHarness } from '@skyux/indicators/testing';
import { SkyPopoverHarness } from '@skyux/popovers/testing';

import { SkyCharacterCounterIndicatorHarness } from '../character-counter/character-counter-indicator-harness';
import { SkyFormErrorsHarness } from '../form-error/form-errors-harness';

import { SkyInputBoxHarnessFilters } from './input-box-harness-filters';

/**
 * Harness for interacting with an input box component in tests.
 */
export class SkyInputBoxHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-input-box';

  #getHintText = this.locatorForOptional('.sky-input-box-hint-text');
  #getLabel = this.locatorForOptional('.sky-control-label');
  #getWrapper = this.locatorFor('.sky-input-box');

  async #getFormError(): Promise<SkyFormErrorsHarness> {
    return this.locatorFor(SkyFormErrorsHarness)();
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
   * Returns a child harness or throws error if not found.
   */
  public async queryHarness<T extends ComponentHarness>(
    query: HarnessQuery<T>,
  ): Promise<T> {
    return this.locatorFor(query)();
  }

  /**
   * Returns a child harness or null if not found.
   */
  public async queryHarnessForOptional<T extends ComponentHarness>(
    query: HarnessQuery<T>,
  ): Promise<T | null> {
    return this.locatorForOptional(query)();
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
   * Whether the custom error is triggered.
   */
  public async hasCustomFormError(errorName: string): Promise<boolean> {
    return (await this.#getFormError()).hasError(errorName);
  }

  /**
   * Whether the required field is empty.
   */
  public async hasRequiredError(): Promise<boolean> {
    return (await this.#getFormError()).hasError('required');
  }

  /**
   * Whether the field has more characters than allowed.
   */
  public async hasMaxLengthError(): Promise<boolean> {
    return (await this.#getFormError()).hasError('maxlength');
  }

  /**
   * Whether the field has fewer characters than allowed.
   */
  public async hasMinLengthError(): Promise<boolean> {
    return (await this.#getFormError()).hasError('minlength');
  }

  /**
   * Whether the field is set to an invalid email address.
   */
  public async hasEmailError(): Promise<boolean> {
    return (await this.#getFormError()).hasError('email');
  }

  /**
   * Whether the field is set to an invalid URL.
   */
  public async hasUrlError(): Promise<boolean> {
    return (await this.#getFormError()).hasError('url');
  }

  /**
   * Whether the field is set to an invalid date.
   */
  public async hasDateError(): Promise<boolean> {
    return (await this.#getFormError()).hasError('date');
  }

  /**
   * Whether the field is set to an invalid phone number.
   */
  public async hasPhoneFieldError(): Promise<boolean> {
    return (await this.#getFormError()).hasError('phone');
  }

  /**
   * Whether the field is set to an invalid time.
   */
  public async hasTimeError(): Promise<boolean> {
    return (await this.#getFormError()).hasError('time');
  }

  /**
   * Indicates whether the input box has disabled styles applied.
   */
  public async getDisabled(): Promise<boolean> {
    const wrapper = await this.#getWrapper();

    return wrapper.hasClass('sky-input-box-disabled');
  }

  /**
   * Gets the text for the input box label.
   */
  public async getLabelText(): Promise<string> {
    const label = await this.#getLabel();

    return this.#getElementTextOrDefault(label);
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

  /**
   * Gets the hint text for the input box.
   */
  public async getHintText(): Promise<string> {
    const hintText = await this.#getHintText();

    return this.#getElementTextOrDefault(hintText);
  }

  /**
   * Indicates whether the input box has stacked styles applied.
   */
  public async getStacked(): Promise<boolean> {
    const host = await this.host();

    return host.hasClass('sky-margin-stacked-lg');
  }

  async #getElementTextOrDefault(el: TestElement | null): Promise<string> {
    return (await el?.text())?.trim() ?? '';
  }
}
