import { ComponentHarness } from '@angular/cdk/testing';

import { SkyHelpInlineHarness } from '../help-inline/help-inline-harness';

/**
 * Shared harness for interacting with help inline popover functionality in tests.
 */
export class SkyHelpInlinePopoverHarness extends ComponentHarness {
  /**
   * Gets the help inline popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  /**
   * Gets the help inline popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
