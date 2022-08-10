import { SkyComponentHarness } from '@skyux/core/testing';

export class SkySearchHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-search';

  #getInput = this.locatorFor('input.sky-search-input');

  #getSubmitButton = this.locatorFor('button.sky-search-btn-apply');

  public async clear(): Promise<void> {
    return (await this.#getInput()).clear();
  }

  public async enterText(value: string): Promise<void> {
    const input = await this.#getInput();
    await input.clear();
    await input.focus();
    await input.sendKeys(value);
    await this.clickSubmitButton();
  }

  public async focus(): Promise<void> {
    return (await this.#getInput()).focus();
  }

  public async clickSubmitButton() {
    return (await this.#getSubmitButton()).click();
  }
}
