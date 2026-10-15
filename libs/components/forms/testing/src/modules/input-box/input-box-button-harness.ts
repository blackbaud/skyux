import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyInputBoxButtonStyle } from '@skyux/forms';
import { SkyIconHarness } from '@skyux/icon/testing';

import { SkyInputBoxButtonHarnessFilters } from './input-box-button-harness-filters';

/**
 * Harness for interacting with an input box button component in tests.
 */
export class SkyInputBoxButtonHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-input-box-button';

  #getButton = this.locatorFor('button');
  #getIcon = this.locatorFor(SkyIconHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyInputBoxButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyInputBoxButtonHarnessFilters,
  ): HarnessPredicate<SkyInputBoxButtonHarness> {
    return SkyInputBoxButtonHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the button.
   */
  public async blur(): Promise<void> {
    await (await this.#getButton()).blur();
  }

  /**
   * Clicks the button.
   */
  public async click(): Promise<void> {
    await (await this.#getButton()).click();
  }

  /**
   * Focuses the button.
   */
  public async focus(): Promise<void> {
    await (await this.#getButton()).focus();
  }

  /**
   * Gets the button's display style.
   */
  public async getButtonStyle(): Promise<SkyInputBoxButtonStyle> {
    return (await (await this.host()).hasClass('sky-input-box-btn-inset'))
      ? 'inset'
      : 'default';
  }

  /**
   * Gets the name of the displayed icon.
   */
  public async getIconName(): Promise<string | undefined> {
    return await (await this.#getIcon()).getIconName();
  }

  /**
   * Gets the button's label text, which is used as its ARIA label.
   */
  public async getLabelText(): Promise<string | null> {
    return await (await this.#getButton()).getAttribute('aria-label');
  }

  /**
   * Gets the button's position in the input box.
   */
  public async getPosition(): Promise<'left' | 'right'> {
    return (await (await this.host()).getAttribute('position')) === 'left'
      ? 'left'
      : 'right';
  }

  /**
   * Whether the button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return await (await this.#getButton()).getProperty<boolean>('disabled');
  }

  /**
   * Whether the button is focused.
   */
  public async isFocused(): Promise<boolean> {
    return await (await this.#getButton()).isFocused();
  }
}
