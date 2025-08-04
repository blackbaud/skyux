import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyHelpInlineHarness } from '../help-inline/help-inline-harness';

/**
 * @deprecated Use the utility functions from help-inline-utils.ts instead.
 * Import { getHelpPopoverContent, getHelpPopoverTitle, clickHelpInline } from '@skyux/help-inline/testing'
 * This class will be removed in a future version.
 */
export class SkyHelpInlinePopoverHarness extends SkyComponentHarness {
  /**
   * @deprecated Use getHelpPopoverContent utility function instead
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  /**
   * @deprecated Use getHelpPopoverTitle utility function instead
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  /**
   * @deprecated Use clickHelpInline utility function instead
   */
  public async clickHelpInline(): Promise<void> {
    return await (await this.#getHelpInline()).click();
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
