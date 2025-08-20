import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyConfirmType } from '@skyux/modals';

import { SkyConfirmButtonHarness } from './confirm-button-harness';
import { SkyConfirmButtonHarnessFilters } from './confirm-button-harness-filters';

/**
 * Harness for interacting with a confirm component in tests.
 */
export class SkyConfirmHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-confirm';

  #getBodyEl = this.locatorForOptional('.sky-confirm-body');
  #getButtons = this.locatorForAll(SkyConfirmButtonHarness);
  #getConfirmEl = this.locatorFor('.sky-confirm');
  #getMessageEl = this.locatorFor('.sky-confirm-message');

  /**
   * Clicks a confirm button.
   */
  public async clickCustomButton(
    filters: SkyConfirmButtonHarnessFilters,
  ): Promise<void> {
    const buttons = await this.getCustomButtons(filters);

    if (buttons.length > 1) {
      if (filters.text instanceof RegExp) {
        filters.text = filters.text.toString();
      }
      throw new Error(
        `More than one button matches the filter(s): ${JSON.stringify(
          filters,
        )}.`,
      );
    }
    await buttons[0].click();
  }

  /**
   * Clicks a confirm button.
   */
  public async clickOkButton(): Promise<void> {
    const type = await this.getType();

    if (type === SkyConfirmType.Custom) {
      throw new Error('Cannot click OK button on a confirm of type custom.');
    }
    const buttons = await this.#getButtons();
    await buttons[0].click();
  }

  /**
   * Gets the body of the confirm component.
   */
  public async getBodyText(): Promise<string | undefined> {
    return await (await this.#getBodyEl())?.text();
  }

  /**
   * Gets a specific confirm custom button that meets certain criteria.
   */
  public async getCustomButton(
    filter: SkyConfirmButtonHarnessFilters,
  ): Promise<SkyConfirmButtonHarness> {
    const confirmType = await this.getType();

    if (confirmType === SkyConfirmType.OK) {
      throw new Error('Cannot get custom button for confirm of type OK.');
    }

    return await this.locatorFor(SkyConfirmButtonHarness.with(filter))();
  }

  /**
   * Gets an array of confirm custom buttons.
   */
  public async getCustomButtons(
    filters?: SkyConfirmButtonHarnessFilters,
  ): Promise<SkyConfirmButtonHarness[]> {
    const confirmType = await this.getType();

    if (confirmType === SkyConfirmType.OK) {
      throw new Error('Cannot get custom buttons for confirm of type OK.');
    }

    const harnesses = await this.locatorForAll(
      SkyConfirmButtonHarness.with(filters || {}),
    )();

    if (filters && harnesses.length === 0) {
      // Stringify the regular expression so that it's readable in the console log.
      if (filters.text instanceof RegExp) {
        filters.text = filters.text.toString();
      }

      throw new Error(
        `Could not find buttons matching filter(s): ${JSON.stringify(
          filters,
        )}.`,
      );
    }

    return harnesses;
  }

  /**
   * Gets the message of the confirm component.
   */
  public async getMessageText(): Promise<string> {
    return await (await this.#getMessageEl()).text();
  }

  /**
   * Gets the type of the confirm component.
   */
  public async getType(): Promise<SkyConfirmType> {
    const confirmEl = await this.#getConfirmEl();
    if (await confirmEl.hasClass('sky-confirm-type-ok')) {
      return SkyConfirmType.OK;
    }

    return SkyConfirmType.Custom;
  }

  /**
   * Whether the whitespace is preserved on the confirm component.
   */
  public async isWhiteSpacePreserved(): Promise<boolean> {
    return await (
      await this.#getMessageEl()
    ).hasClass('sky-confirm-preserve-white-space');
  }
}
