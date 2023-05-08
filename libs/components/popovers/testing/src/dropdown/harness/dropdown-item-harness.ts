import { SkyComponentHarness } from '@skyux/core/testing';

export class SkyDropdownItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown-item';

  #getItem = this.locatorFor('.sky-dropdown-item');
  #getButton = this.locatorFor('button,a');

  /**
   * Clicks the dropdown item.
   */
  public async click(): Promise<void> {
    await (await this.#getButton()).click();
  }

  /**
   * Gets the dropdown item role.
   */
  public async getRole(): Promise<string | null> {
    return (await this.#getItem()).getAttribute('role');
  }

  /**
   * Gets the menu item text.
   */
  public async getText(): Promise<string | null> {
    return (await this.host()).text();
  }
}
