import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  HelpPopoverHarnessMethods,
  clickHelpInline,
  getHelpPopoverContent,
  getHelpPopoverTitle,
} from '@skyux/help-inline/testing';

import { SkyToggleSwitchHarnessFilters } from './toggle-switch-harness-filters';
import { SkyToggleSwitchLabelHarness } from './toggle-switch-label-harness';

/**
 * Harness for interacting with a toggle switch component in tests.
 */
export class SkyToggleSwitchHarness
  extends SkyComponentHarness
  implements HelpPopoverHarnessMethods
{
  /**
   * @internal
   */
  public static hostSelector = 'sky-toggle-switch';

  #getButton = this.locatorFor('button.sky-toggle-switch-button');
  #getLabel = this.locatorForOptional(SkyToggleSwitchLabelHarness);
  #getLabelText = this.locatorForOptional('span.sky-toggle-switch-label-text');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyToggleSwitchHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyToggleSwitchHarnessFilters,
  ): HarnessPredicate<SkyToggleSwitchHarness> {
    return SkyToggleSwitchHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the toggle switch.
   */
  public async blur(): Promise<void> {
    await (await this.#getButton()).blur();
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    return await clickHelpInline(this);
  }

  /**
   * Gets the help popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await getHelpPopoverContent(this);
  }

  /**
   * Gets the help popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await getHelpPopoverTitle(this);
  }

  /**
   * Puts the toggle switch in a checked state.
   */
  public async check(): Promise<void> {
    if (!(await this.isChecked())) {
      await this.#toggle();
    }
  }

  /**
   * Focuses the toggle switch.
   */
  public async focus(): Promise<void> {
    await (await this.#getButton()).focus();
  }

  /**
   * Whether the label is hidden. Only supported when using the `labelText` input to set the label.
   */
  public async getLabelHidden(): Promise<boolean> {
    const labelText = await this.#getLabelText();
    const labelComponent = await this.#getLabel();

    if (labelComponent) {
      throw new Error(
        '`labelHidden` is only supported when setting the toggle switch label via the `labelText` input.',
      );
    } else {
      return !(await labelText?.text());
    }
  }

  /**
   * Gets the toggle switch's label text. If the label is set via `labelText` and `labelHidden` is true,
   * the text will still be returned.
   */
  public async getLabelText(): Promise<string | undefined> {
    const labelText = await (await this.#getLabelText())?.text();
    const ariaLabel = await this.#getAriaLabel();

    return (
      labelText || ariaLabel || (await (await this.#getLabel())?.getText())
    );
  }

  /**
   * Whether the toggle switch is checked.
   */
  public async isChecked(): Promise<boolean> {
    return await (
      await this.#getButton()
    ).hasClass('sky-toggle-switch-checked');
  }

  /**
   * Whether the toggle switch is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.#getButton()).getAttribute('disabled');
    return disabled !== null;
  }

  /**
   * Whether the toggle switch is focused.
   */
  public async isFocused(): Promise<boolean> {
    return await (await this.#getButton()).isFocused();
  }

  /**
   * Puts the toggle switch in an unchecked state.
   */
  public async uncheck(): Promise<void> {
    if (await this.isChecked()) {
      await this.#toggle();
    }
  }

  async #getAriaLabel(): Promise<string | null> {
    return await (await this.#getButton()).getAttribute('aria-label');
  }

  async #toggle(): Promise<void> {
    if (await this.isDisabled()) {
      throw new Error(
        'Could not toggle the toggle switch because it is disabled.',
      );
    } else {
      await (await this.#getButton()).click();
    }
  }
}
