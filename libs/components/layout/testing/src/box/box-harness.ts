import { HarnessPredicate } from '@angular/cdk/testing';
import { TemplateRef } from '@angular/core';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyBoxHeadingLevel, SkyBoxHeadingStyle } from '@skyux/layout';

import { SkyBoxHarnessFilters } from './box-harness.filters';

export class SkyBoxHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-box';

  #getBox = this.locatorFor('.sky-box');
  #getHeading = this.locatorFor('.sky-box-header-content');
  #getH2 = this.locatorForOptional('.sky-box-header-content h2');
  #getH3 = this.locatorForOptional('.sky-box-header-content h3');
  #getH4 = this.locatorForOptional('.sky-box-header-content h4');
  #getH5 = this.locatorForOptional('.sky-box-header-content h5');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyBoxHarness` that meets certain criteria
   */
  public static with(
    filters: SkyBoxHarnessFilters,
  ): HarnessPredicate<SkyBoxHarness> {
    return SkyBoxHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    return (await this.#getHelpInline()).click();
  }

  /**
   * Gets the help popover content.
   */
  public async getHelpPopoverContent(): Promise<
    TemplateRef<unknown> | string | undefined
  > {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  /**
   * Gets the help popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  /**
   * Gets the box's heading text. If `headingHidden` is true,
   * the text will still be returned.
   */
  public async getHeadingText(): Promise<string | undefined> {
    return (await this.#getHeading()).text();
  }

  /**
   * Whether the heading is hidden.
   */
  public async getHeadingHidden(): Promise<boolean> {
    return (await this.#getHeading()).hasClass('sky-screen-reader-only');
  }

  /**
   * The semantic heading level used for the checkbox group. Returns undefined if heading level is not set.
   */
  public async getHeadingLevel(): Promise<SkyBoxHeadingLevel | undefined> {
    return (await this.#getH2())
      ? 2
      : (await this.#getH3())
        ? 3
        : (await this.#getH4())
          ? 4
          : 5;
  }

  /**
   * The heading style used for the checkbox group.
   */
  public async getHeadingStyle(): Promise<SkyBoxHeadingStyle> {
    const heading =
      (await this.#getH2()) ||
      (await this.#getH3()) ||
      (await this.#getH4()) ||
      (await this.#getH5());

    const isHeadingStyle2 = await heading?.hasClass('sky-font-heading-2');
    const isHeadingStyle3 = await heading?.hasClass('sky-font-heading-3');
    const isHeadingStyle4 = await heading?.hasClass('sky-font-heading-4');

    return isHeadingStyle2 ? 2 : isHeadingStyle3 ? 3 : isHeadingStyle4 ? 4 : 5;
  }

  /**
   * Gets the aria-label property of the box
   */
  public async getAriaLabel(): Promise<string | null> {
    return (await this.#getBox()).getAttribute('aria-label');
  }

  /**
   * Gets the aria-labelledby property of the box
   */
  public async getAriaLabelledby(): Promise<string | null> {
    return (await this.#getBox()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the aria-role property of the box
   */
  public async getAriaRole(): Promise<string | null> {
    return (await this.#getBox()).getAttribute('role');
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(
      SkyHelpInlineHarness.with({
        ancestor: '.sky-box-header-content',
      }),
    )();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
