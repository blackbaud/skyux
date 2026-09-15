import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyButtonStyle, SkyButtonType } from '@skyux/forms';
import { SkyIconHarness } from '@skyux/icon/testing';
import { SkyButtonHarnessFilters } from './button-harness-filters';

/**
 * Harness for interacting with a button component in tests.
 */
export class SkyButtonHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-button';

  #getButton = this.locatorForOptional('button');
  #getAnchor = this.locatorForOptional('a');
  #getIcon = this.locatorForOptional(SkyIconHarness);
  #getAnchorOrButton = this.locatorFor('button, a');

  #getLabelTextLabel = this.locatorForOptional('span');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyButtonHarnessFilters,
  ): HarnessPredicate<SkyButtonHarness> {
    return SkyButtonHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the button.
   */
  public async blur(): Promise<void> {
    await (await this.#getAnchorOrButton())?.blur();
  }

  /**
   * Clicks the button.
   */
  public async click(): Promise<void> {
    await (await this.#getAnchorOrButton())?.click();
  }

  /**
   * Focuses the button.
   */
  public async focus(): Promise<void> {
    await (await this.#getAnchorOrButton())?.focus();
  }

  /**
   * Gets the button's style.
   */
  public async getButtonStyle(): Promise<SkyButtonStyle> {
    const anchorOrButton = await this.#getAnchorOrButton();

    const buttonStyles: SkyButtonStyle[] = [
      'danger',
      'default',
      'icon-borderless',
      'link',
      'link-inline',
      'primary',
    ];

    for (const buttonStyle of buttonStyles) {
      if (await anchorOrButton?.hasClass(`sky-btn-${buttonStyle}`)) {
        return buttonStyle;
      }
    }

    /* istanbul ignore next */
    throw new Error('Unable to determine button style.');
  }

  /**
   * Gets the button's type.
   */
  public async getButtonType(): Promise<SkyButtonType | undefined> {
    const button = await this.#getButton();

    return (await button?.getAttribute('type')) as SkyButtonType | undefined;
  }

  /**
   * Gets the button's label text. If the label is set via `labelText` and `labelHidden` is true,
   * the text will still be returned.
   */
  public async getLabelText(): Promise<string> {
    const labelTextLabel = await this.#getLabelTextLabel();

    if (labelTextLabel) {
      return await labelTextLabel.text();
    }

    return (await this.#getAriaLabel()) as string;
  }

  /**
   * Whether the label is hidden. Only supported when using the `labelText` input to set the label.
   */
  public async getLabelHidden(): Promise<boolean> {
    const labelTextLabel = await this.#getLabelTextLabel();
    return !(await labelTextLabel?.text());
  }

  /**
   * Whether the button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.#getButton())?.getAttribute('disabled');
    return disabled !== null;
  }

  /**
   * Whether the button is focused.
   */
  public async isFocused(): Promise<boolean> {
    return await (await this.#getAnchorOrButton()).isFocused();
  }

  /**
   * Gets the name of the displayed icon, or undefined if no icon is displayed.
   */
  public async getIconName(): Promise<string | undefined> {
    return await (await this.#getIcon())?.getIconName();
  }

  /**
   * Whether the button is a block button.
   */
  public async isBlock(): Promise<boolean> {
    return await (await this.#getAnchorOrButton()).hasClass('sky-btn-block');
  }

  /**
   * Whether the button is displaying a logo. This will return false when no icon
   * is displayed, even when the logo input is set to true.
   */
  public async isLogo(): Promise<boolean> {
    const iconHost = await (await this.#getIcon())?.host();
    return !!(await iconHost?.hasClass('sky-btn-block-logo'));
  }

  /**
   * Gets the resolved URL for the current permalink, or undefined if no permalink
   * is specified.
   */
  public async getUrl(): Promise<string | undefined> {
    const anchor = await this.#getAnchor();

    return (await anchor?.getAttribute('href')) ?? undefined;
  }

  async #getAriaLabel(): Promise<string | null> {
    return await (await this.#getAnchorOrButton()).getAttribute('aria-label');
  }
}
