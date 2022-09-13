import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyConfirmType } from '@skyux/modals';

/**
 * Harness for interacting with a confirm component in tests.
 * @internal
 */
export class SkyConfirmHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-confirm';

  #getMessageEl = this.locatorFor('.sky-confirm-message');
  #getBodyEl = this.locatorForOptional('.sky-confirm-body');
  #getButtonsEl = this.locatorForAll('.sky-confirm-buttons .sky-btn');

  /**
   * Gets the message of the confirm component.
   */
  public async getMessageText(): Promise<string> {
    return await (await this.#getMessageEl()).text();
  }

  /**
   * Gets the body of the confirm component.
   */
  public async getBodyText(): Promise<string | undefined> {
    const bodyEl = await this.#getBodyEl();

    if (bodyEl) {
      return await bodyEl.text();
    }
    return undefined;
  }

  /**
   * Gets the type of the confirm component.
   */
  public async getType(): Promise<SkyConfirmType | undefined> {
    const buttonsEl = await this.#getButtonsEl();

    if (buttonsEl.length === 1 && (await buttonsEl[0].text()) === 'OK') {
      return SkyConfirmType.OK;
    }

    return SkyConfirmType.Custom;
  }

  /**
   * Indicates if the whitespace is preserved on the confirom component.
   */
  public async getWhiteSpaceIsPreserved(): Promise<boolean> {
    return await (
      await this.#getMessageEl()
    ).hasClass('sky-confirm-preserve-white-space');
  }

  /**
   * Clicks the OK button for confirm components of type `OK`. For other types, use `clickCustomButtonByText()`.
   */
  public async clickOKConfirmButton(): Promise<void> {
    const type = await this.getType();

    if (type !== SkyConfirmType.OK) {
      throw new Error(
        '`clickOKButton` should only be used with confirm components with type `OK`'
      );
    }

    const buttons = await this.#getButtonsEl();
    await buttons[0].click();
  }

  /**
   * Clicks the button with the given text for confirm components of type `Custom`. For `OK` confirms, use `clickOKButton()`;
   */
  public async clickCustomButtonByText(text: string): Promise<void> {
    const type = await this.getType();

    if (type !== SkyConfirmType.Custom) {
      throw new Error(
        '`clickCustomButtonByText` should only be used with confirm components with type `Custom`'
      );
    }

    const buttons = await this.#getButtonsEl();
    const buttonsText: string[] = [];

    for (const btn of buttons) {
      buttonsText.push(await btn.text());
    }

    const buttonIndex = buttonsText.findIndex((btnText) => btnText === text);

    if (buttonIndex === -1) {
      throw new Error(`No button was found with the text "${text}"`);
    }

    const button = buttons[buttonIndex];
    await button.click();
  }
}
