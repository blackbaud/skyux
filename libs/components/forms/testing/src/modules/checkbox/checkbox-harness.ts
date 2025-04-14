import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyFormErrorsHarness } from '../form-error/form-errors-harness';

import { SkyCheckboxHarnessFilters } from './checkbox-harness-filters';
import { SkyCheckboxLabelHarness } from './checkbox-label-harness';
import { SkyCheckboxLabelTextLabelHarness } from './checkbox-label-text-label.harness';

/**
 * Harness for interacting with a checkbox component in tests.
 */
export class SkyCheckboxHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-checkbox';

  #getHintText = this.locatorForOptional('.sky-checkbox-hint-text');

  #getInput = this.locatorFor('input.sky-checkbox-input');

  #getLabel = this.locatorForOptional(SkyCheckboxLabelHarness);

  #getLabelTextLabel = this.locatorForOptional(
    SkyCheckboxLabelTextLabelHarness,
  );

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
    await (await this.#getInput()).blur();
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    await (await this.#getHelpInline()).click();
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
    await (await this.#getInput()).focus();
  }

  /**
   * Gets the checkbox's aria-label.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getInput()).getAttribute('aria-label');
  }

  /**
   * Gets the checkbox's aria-labelledby.
   */
  public async getAriaLabelledby(): Promise<string | null> {
    return await (await this.#getInput()).getAttribute('aria-labelledby');
  }

  /**
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
      return await label?.getText();
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
        '`labelHidden` is only supported when setting the checkbox label via the `labelText` input.',
      );
    } else {
      return !(await labelTextLabel?.getText());
    }
  }

  /**
   * Gets the checkbox's hint text.
   */
  public async getHintText(): Promise<string> {
    const hintText = await this.#getHintText();

    return (await hintText?.text())?.trim() ?? '';
  }

  /**
   * Gets the checkbox's name.
   */
  public async getName(): Promise<string | null> {
    return await (await this.#getInput()).getAttribute('name');
  }

  /**
   * Gets the checkbox's value.
   */
  public async getValue(): Promise<string | null> {
    return await (await this.#getInput()).getProperty<string | null>('value');
  }

  /**
   * Whether the checkbox displays custom error.
   */
  public async hasCustomError(errorName: string): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError(errorName);
  }

  /**
   * Whether the checkbox displays an error that it is required.
   */
  public async hasRequiredError(): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError('required');
  }

  /**
   * Whether the checkbox is checked.
   */
  public async isChecked(): Promise<boolean> {
    return await (await this.#getInput()).getProperty<boolean>('checked');
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
    return await (await this.#getInput()).isFocused();
  }

  /**
   * Whether the checkbox is required.
   */
  public async isRequired(): Promise<boolean> {
    const value = await (await this.#getInput()).getAttribute('required');
    return value !== null;
  }

  /**
   * Whether the checkbox is stacked.
   */
  public async isStacked(): Promise<boolean> {
    return await (await this.host()).hasClass('sky-form-field-stacked');
  }

  /**
   * Puts the checkbox in an unchecked state by toggling it if it is currently checked, or doing nothing if it is already unchecked.
   */
  public async uncheck(): Promise<void> {
    if (await this.isChecked()) {
      await this.#toggle();
    }
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

  async #toggle(): Promise<void> {
    if (await this.isDisabled()) {
      throw new Error('Could not toggle the checkbox because it is disabled.');
    } else {
      await (await this.#getInput()).click();
    }
  }
}
