import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  SkyRadioGroupHeadingLevel,
  SkyRadioGroupHeadingStyle,
} from '@skyux/forms';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyFormErrorsHarness } from '../form-error/form-errors-harness';

import { SkyRadioGroupHarnessFilters } from './radio-group-harness-filters';
import { SkyRadioHarness } from './radio-harness';

/**
 * Harness for interacting with a radio group component in tests.
 */
export class SkyRadioGroupHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-radio-group';

  #getH3 = this.locatorForOptional('legend h3');
  #getH4 = this.locatorForOptional('legend h4');
  #getH5 = this.locatorForOptional('legend h5');
  #getHeading = this.locatorFor('.sky-control-label');
  #getHeadingText = this.locatorForOptional(
    'legend .sky-radio-group-heading-text',
  );
  #getHintText = this.locatorForOptional('.sky-radio-group-hint-text');
  #getRadioButtons = this.locatorForAll(SkyRadioHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyRadioGroupHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyRadioGroupHarnessFilters,
  ): HarnessPredicate<SkyRadioGroupHarness> {
    return SkyRadioGroupHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    return (await this.#getHelpInline()).click();
  }

  /**
   * Whether the heading is hidden.
   */
  public async getHeadingHidden(): Promise<boolean> {
    return (await this.#getHeading()).hasClass('sky-screen-reader-only');
  }

  /**
   * The semantic heading level used for the radio group. Returns undefined if heading level is not set.
   */
  public async getHeadingLevel(): Promise<
    SkyRadioGroupHeadingLevel | undefined
  > {
    const h3 = await this.#getH3();
    const h4 = await this.#getH4();
    const h5 = await this.#getH5();

    if (h3) {
      return 3;
    } else if (h4) {
      return 4;
    } else if (h5) {
      return 5;
    } else {
      return undefined;
    }
  }

  /**
   * The heading style used for the radio group.
   */
  public async getHeadingStyle(): Promise<SkyRadioGroupHeadingStyle> {
    const headingOrLabel =
      (await this.#getH3()) ||
      (await this.#getH4()) ||
      (await this.#getH5()) ||
      (await this.#getHeadingText());

    const isHeadingStyle3 =
      await headingOrLabel?.hasClass('sky-font-heading-3');
    const isHeadingStyle4 =
      await headingOrLabel?.hasClass('sky-font-heading-4');

    if (isHeadingStyle3) {
      return 3;
    } else if (isHeadingStyle4) {
      return 4;
    } else {
      return 5;
    }
  }

  /**
   * Gets the radio group's heading text. If `headingHidden` is true,
   * the text will still be returned.
   */
  public async getHeadingText(): Promise<string | undefined> {
    return (await this.#getHeading()).text();
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
   * Gets the radio group's hint text.
   */
  public async getHintText(): Promise<string> {
    const hintText = await this.#getHintText();

    return (await hintText?.text())?.trim() ?? '';
  }

  /**
   * Gets an array of harnesses for the radio buttons in the radio group.
   */
  public async getRadioButtons(): Promise<SkyRadioHarness[]> {
    return await this.#getRadioButtons();
  }

  /**
   * Whether the radio group is required.
   */
  public async getRequired(): Promise<boolean> {
    const heading = await this.#getHeading();

    return await heading.hasClass('sky-control-label-required');
  }

  /**
   * Whether the radio group is stacked.
   */
  public async getStacked(): Promise<boolean> {
    const host = await this.host();
    const heading =
      (await this.#getH3()) || (await this.#getH4()) || (await this.#getH5());
    const label = await this.#getHeadingText();

    return (
      ((await host.hasClass('sky-margin-stacked-lg')) && !!label) ||
      ((await host.hasClass('sky-margin-stacked-xl')) && !!heading)
    );
  }

  /**
   * Whether the radio group has errors.
   */
  public async hasError(errorName: string): Promise<boolean> {
    return (await this.#getFormErrors()).hasError(errorName);
  }

  async #getFormErrors(): Promise<SkyFormErrorsHarness> {
    return await this.locatorFor(SkyFormErrorsHarness)();
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(
      SkyHelpInlineHarness.with({
        ancestor: '.sky-radio-group > .sky-radio-group-label-wrapper',
      }),
    )();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
