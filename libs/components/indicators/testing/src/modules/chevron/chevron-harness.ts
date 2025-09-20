import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with a chevron component in tests.
 * @internal
 */
export class SkyChevronHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-chevron';

  #getButton = this.locatorFor('button.sky-chevron');

  /**
   * Gets the chevron direction.
   */
  public async getDirection(): Promise<string> {
    return (await (await this.#getButton()).hasClass('sky-chevron-up'))
      ? 'up'
      : 'down';
  }

  /**
   * Whether the chevron is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.#getButton()).getAttribute('disabled');
    return disabled !== null;
  }

  /**
   * Toggles the chevron.
   */
  public async toggle(): Promise<void> {
    if (await this.isDisabled()) {
      throw new Error('Could not toggle the checkbox because it is disabled.');
    } else {
      await (await this.#getButton()).click();
    }
  }
}
