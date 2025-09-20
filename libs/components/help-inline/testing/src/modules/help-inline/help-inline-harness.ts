import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  SkyPopoverContentHarness,
  SkyPopoverHarness,
} from '@skyux/popovers/testing';

import { SkyHelpInlineHarnessFilters } from './help-inline-harness.filters';

/**
 * Harness for interacting with a help inline button component in tests.
 */
export class SkyHelpInlineHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-help-inline';

  #getInlineHelpButton = this.locatorFor('.sky-help-inline');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyHelpInlineHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyHelpInlineHarnessFilters,
  ): HarnessPredicate<SkyHelpInlineHarness> {
    return SkyHelpInlineHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the help inline button.
   */
  public async click(): Promise<void> {
    const button = await this.#getInlineHelpButton();

    if (await button.hasClass('sky-help-inline-hidden')) {
      throw new Error(
        'Unable to click the help inline button because it is hidden.',
      );
    }

    await button.click();
  }

  /**
   * Gets the `aria-controls` value.
   */
  public async getAriaControls(): Promise<string | null> {
    return await (
      await this.#getInlineHelpButton()
    ).getAttribute('aria-controls');
  }

  /**
   * Gets the `aria-expanded` value.
   */
  public async getAriaExpanded(): Promise<boolean> {
    if ((await this.getAriaControls()) === null) {
      throw new Error('aria-expanded is only set when `ariaControls` is set.');
    }

    return (
      (await (
        await this.#getInlineHelpButton()
      ).getAttribute('aria-expanded')) === 'true'
    );
  }

  /**
   * Gets the `aria-label` value.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getInlineHelpButton()).getAttribute('aria-label');
  }

  /**
   * Gets the `aria-labelledby` value.
   * @internal
   */
  public async getAriaLabelledBy(): Promise<string | null> {
    return await (await this.#getInlineHelpButton())
      .getAttribute('aria-labelledby')
      .then((ref) => {
        if (ref) {
          // Remove the 'aria-labelledby' prefix id.
          return ref.substring(ref.indexOf(' ') + 1);
        }
        return null;
      });
  }

  /**
   * Gets the label text.
   */
  public async getLabelText(): Promise<string | undefined> {
    const ariaLabel = await this.getAriaLabel();

    if (ariaLabel?.startsWith('Show help content ')) {
      return ariaLabel.replace('Show help content for ', '');
    }

    return undefined;
  }

  /**
   * Gets the help popover content.
   */
  public async getPopoverContent(): Promise<string | undefined> {
    return await (await this.#getPopoverHarnessContent())?.getBodyText();
  }

  /**
   * Gets the help popover title.
   */
  public async getPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getPopoverHarnessContent())?.getTitleText();
  }

  async #getPopoverHarnessContent(): Promise<
    SkyPopoverContentHarness | undefined
  > {
    return await (
      await this.locatorForOptional(SkyPopoverHarness)()
    )?.getPopoverContent();
  }
}
