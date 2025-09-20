import { ComponentHarness } from '@angular/cdk/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyDescriptionListDescriptionHarness } from './description-list-description-harness';
import { SkyDescriptionListTermHarness } from './description-list-term-harness';

/**
 * Harness for interacting with a description list content component in tests.
 */
export class SkyDescriptionListContentHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'div.sky-description-list-content';

  #getDescription = this.locatorForOptional(
    SkyDescriptionListDescriptionHarness,
  );
  #getTerm = this.locatorForOptional(SkyDescriptionListTermHarness);

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    await (await this.#getHelpInline()).click();
  }

  /**
   * Gets the description component text.
   */
  public async getDescriptionText(): Promise<string> {
    const description = await this.#getDescription();

    if (description === null) {
      throw Error('No description list description found.');
    }

    return await description.getText();
  }

  /**
   * Gets the help popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  /**
   * Gets the help popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  /**
   * Gets the term component text.
   */
  public async getTermText(): Promise<string> {
    const term = await this.#getTerm();

    if (term === null) {
      throw Error('No description list term found.');
    }

    return await term.getText();
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
