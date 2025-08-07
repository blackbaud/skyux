import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyRadioHarnessFilters } from './radio-harness-filters';
import { SkyRadioLabelHarness } from './radio-label-harness';

/**
 * Harness for interacting with a radio button component in tests.
 */
export class SkyRadioHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-radio';

  #getHintText = this.locatorForOptional('.sky-radio-hint-text');

  #getInput = this.locatorFor('input.sky-radio-input');

  #getLabel = this.locatorForOptional(SkyRadioLabelHarness);

  #getLabelText = this.locatorForOptional(
    'span.sky-switch-label.sky-radio-label-text',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyRadioHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyRadioHarnessFilters,
  ): HarnessPredicate<SkyRadioHarness> {
    return SkyRadioHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the radio button.
   */
  public async blur(): Promise<void> {
    await (await this.#getInput()).blur();
  }

  /**
   * Puts the radio button in a checked state if it is currently unchecked.
   */
  public async check(): Promise<void> {
    if (await this.isDisabled()) {
      throw new Error(
        'Could not check the radio button because it is disabled.',
      );
    } else if (!(await this.isChecked())) {
      await (await this.#getInput()).click();
    }
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    await (await this.#getHelpInline()).click();
  }

  /**
   * Focuses the radio button.
   */
  public async focus(): Promise<void> {
    await (await this.#getInput()).focus();
  }

  /**
   * Gets the radio button's aria-label.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getInput()).getAttribute('aria-label');
  }

  /**
   * Gets the radio button's aria-labelledby.
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
   * Gets the radio button's hint text.
   */
  public async getHintText(): Promise<string> {
    const hintText = await this.#getHintText();

    return (await hintText?.text())?.trim() ?? '';
  }

  /**
   * Whether the label is hidden. Only supported when using the `labelText` input to set the label.
   */
  public async getLabelHidden(): Promise<boolean> {
    const labelText = await this.#getLabelText();
    const label = await this.#getLabel();

    if (label) {
      throw new Error(
        '`labelHidden` is only supported when setting the radio label via the `labelText` input.',
      );
    } else {
      return !!(await labelText?.hasClass('sky-screen-reader-only'));
    }
  }

  /**
   * Gets the radio button's label text. If the label is set via `labelText` and `labelHidden` is true,
   * the text will still be returned.
   */
  public async getLabelText(): Promise<string | undefined> {
    const labelText = await this.#getLabelText();

    if (labelText) {
      return await labelText.text();
    } else {
      return await (await this.#getLabel())?.getText();
    }
  }

  /**
   * Gets the radio button's name.
   */
  public async getName(): Promise<string | null> {
    return await (await this.#getInput()).getAttribute('name');
  }

  /**
   * Whether the radio button is checked.
   */
  public async isChecked(): Promise<boolean> {
    return await (await this.#getInput()).getProperty<boolean>('checked');
  }

  /**
   * Whether the radio button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.#getInput()).getAttribute('disabled');
    return disabled !== null;
  }

  /**
   * Whether the radio button is focused.
   */
  public async isFocused(): Promise<boolean> {
    return await (await this.#getInput()).isFocused();
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
