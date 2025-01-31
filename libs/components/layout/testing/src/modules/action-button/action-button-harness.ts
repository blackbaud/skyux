import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyIconHarness } from '@skyux/icon/testing';

export class SkyActionButtonHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-action-button';

  #actionButton = this.locatorFor('.sky-action-button');

  /**
   * Clicks the action button.
   */
  public async click(): Promise<void> {
    return await (await this.#actionButton()).click();
  }

  /**
   * Gets the action button header text.
   */
  public async getHeaderText(): Promise<string | null> {
    const header = await this.locatorFor('.sky-action-button-header')();
    return (await header.text()).trim();
  }

  /**
   * Gets the action button details text.
   */
  public async getDetailsText(): Promise<string | null> {
    const details = await this.locatorFor('sky-action-button-details')();
    return (await details.text()).trim();
  }

  /**
   * Gets the action button icon type.
   */
  public async getIconType(): Promise<string | undefined> {
    const icon = await this.locatorFor(SkyIconHarness)();
    return await icon.getIconName();
  }
}
