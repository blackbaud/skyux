import { SkyComponentHarness } from '@skyux/core/testing';
import {
  HelpPopoverHarnessMethods,
  clickHelpInline,
  getHelpPopoverContent,
  getHelpPopoverTitle,
} from '@skyux/help-inline/testing';

import { SkyDescriptionListDescriptionHarness } from './description-list-description-harness';
import { SkyDescriptionListTermHarness } from './description-list-term-harness';

/**
 * Harness for interacting with a description list content component in tests.
 */
export class SkyDescriptionListContentHarness
  extends SkyComponentHarness
  implements HelpPopoverHarnessMethods
{
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
    return await clickHelpInline(this);
  }

  /**
   * Gets the help popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await getHelpPopoverContent(this);
  }

  /**
   * Gets the help popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await getHelpPopoverTitle(this);
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
   * Gets the term component text.
   */
  public async getTermText(): Promise<string> {
    const term = await this.#getTerm();

    if (term === null) {
      throw Error('No description list term found.');
    }

    return await term.getText();
  }
}
