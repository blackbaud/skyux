import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFormErrorsHarness } from '../form-error/form-errors-harness';

import { SkyCheckboxHarnessFilters } from './checkbox-harness-filters';
import { SkyCheckboxLabelHarness } from './checkbox-label-harness';
import { SkyCheckboxLabelTextLabelHarness } from './checkbox-label-text-label.harness';

/**
 * Harness for interacting with a checkbox component in tests.
 * @internal
 */
export class SkyCheckboxHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-checkbox';

  #getInput = this.locatorFor('input.sky-checkbox-input');

  #getLabel = this.locatorForOptional(SkyCheckboxLabelHarness);

  #getLabelTextLabel = this.locatorForOptional(
    SkyCheckboxLabelTextLabelHarness,
  );

  async #getFormErrors(): Promise<SkyFormErrorsHarness> {
    const harness = await this.locatorForOptional(SkyFormErrorsHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No form errors found.');
  }

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyCheckboxHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyCheckboxHarnessFilters,
  ): HarnessPredicate<SkyCheckboxHarness> {
    return SkyCheckboxHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the checkbox.
   */
  public async blur(): Promise<void> {
    return (await this.#getInput()).blur();
  }

  /**
   * Puts the checkbox in a checked state by toggling it if it is currently unchecked, or doing nothing if it is already checked.
   */
  public async check(): Promise<void> {
    if (!(await this.isChecked())) {
      await this.#toggle();
    }
  }

  /**
   * Focuses the checkbox.
   */
  public async focus(): Promise<void> {
    return (await this.#getInput()).focus();
  }

  /**
   * Gets the checkbox's aria-label.
   */
  public async getAriaLabel(): Promise<string | null> {
    return (await this.#getInput()).getAttribute('aria-label');
  }

  /**
   * Gets the checkbox's aria-labelledby.
   */
  public async getAriaLabelledby(): Promise<string | null> {
    return (await this.#getInput()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the checkbox's label text. If the label is set via `labelText` and `labelHidden` is true,
   * the text will still be returned.
   */
  public async getLabelText(): Promise<string | undefined> {
    const labelTextLabel = await this.#getLabelTextLabel();
    const label = await this.#getLabel();

    if (labelTextLabel) {
      const text = await labelTextLabel.getText();
      const ariaLabel = await this.getAriaLabel();

      // if labelText is set, ariaLabel will never return null
      return text || ariaLabel!;
    } else {
      return label?.getText();
    }
  }

  /**
   * Whether the label is hidden. Only supported when using the `labelText` input to set the label.
   */
  public async getLabelHidden(): Promise<boolean> {
    const labelTextLabel = await this.#getLabelTextLabel();
    const label = await this.#getLabel();

    if (label) {
      throw new Error(
        '`labelIsHidden` is only supported when setting the checkbox label via the `labelText` input.',
      );
    } else {
      return !(await labelTextLabel?.getText());
    }
  }

  /**
   * Gets the checkbox's name.
   */
  public async getName(): Promise<string | null> {
    return (await this.#getInput()).getAttribute('name');
  }

  /**
   * Gets the checkbox's value.
   */
  public async getValue(): Promise<string | null> {
    return (await this.#getInput()).getProperty<string | null>('value');
  }

  /**
   * Whether the checkbox is checked.
   */
  public async isChecked(): Promise<boolean> {
    return (await this.#getInput()).getProperty<boolean>('checked');
  }

  /**
   * Whether the checkbox is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.#getInput()).getAttribute('disabled');
    return disabled !== null;
  }

  /**
   * Whether the checkbox is focused.
   */
  public async isFocused(): Promise<boolean> {
    return (await this.#getInput()).isFocused();
  }

  /**
   * Whether the checkbox is required.
   */
  public async isRequired(): Promise<boolean> {
    const value = await (await this.#getInput()).getAttribute('required');
    return value !== null;
  }

  /**
   * Puts the checkbox in an unchecked state by toggling it if it is currently checked, or doing nothing if it is already unchecked.
   */
  public async uncheck(): Promise<void> {
    if (await this.isChecked()) {
      await this.#toggle();
    }
  }

  public async hasRequiredError(): Promise<boolean> {
    return (await this.#getFormErrors()).hasError('required');
  }

  public async hasCustomError(errorName: string): Promise<boolean> {
    return (await this.#getFormErrors()).hasError(errorName);
  }

  async #toggle(): Promise<void> {
    if (await this.isDisabled()) {
      throw new Error('Could not toggle the checkbox because it is disabled.');
    } else {
      await (await this.#getInput()).click();
    }
  }
}
