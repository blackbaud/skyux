import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with a skip link component in tests.
 */
export class SkySkipLinksHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-skip-link-host';

  #getSkipLinks = this.locatorForAll('.sky-skip-link');

  /**
   * Gets the text of the skip link at the given index.
   */
  public async getSkipLinkText(index: number): Promise<string> {
    const skipLinks = await this.#getSkipLinks();

    return await skipLinks[index].text();
  }

  /**
   * Clicks the skip link at the given index.
   */
  public async clickSkipLink(index: number): Promise<void> {
    const skipLinks = await this.#getSkipLinks();

    await skipLinks[index].click();
  }
}
