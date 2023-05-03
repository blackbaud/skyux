import { SkyComponentHarness } from '@skyux/core/testing';

export class SkyDropdownMenuItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown-item';

  #getItem = this.locatorFor('.sky-dropdown-item');
  #getButton = this.locatorFor('button,a');

  public async click(): Promise<void> {
    await (await this.#getButton()).click();
  }

  public async getRole(): Promise<string | null> {
    return (await this.#getItem()).getAttribute('role');
  }
}
