import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  SkyRadioGroupHeadingLevel,
  SkyRadioGroupHeadingStyle,
} from '@skyux/forms';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyFormErrorsHarness } from '../form-error/form-errors-harness';

import { SkyRadioGroupHarnessFilters } from './radio-group-harness-filters';
import { SkyRadioHarness } from './radio-harness';
import { SkyRadioHarnessFilters } from './radio-harness-filters';

/**
 * Harness for interacting with a radio group component in tests.
 */
export class SkyRadioGroupHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-radio-group';

  #getHeading = this.locatorFor('.sky-radio-group-legend span');
  #getHeadingWrapper = this.locatorForOptional('.sky-radio-group-legend');
  #getHintText = this.locatorForOptional('.sky-radio-group-hint-text');
  #getLegendDefault = this.locatorForOptional(
    'legend .sky-radio-group-heading-text',
  );
  #getLegendH3 = this.locatorForOptional('legend h3');
  #getLegendH4 = this.locatorForOptional('legend h4');
  #getLegendH5 = this.locatorForOptional('legend h5');
  #getLegendHeading = this.locatorForOptional(
    'legend h3,h4,h5,.sky-radio-group-heading-text',
  );

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
    await (await this.#getHelpInline()).click();
  }

  /**
   * Whether the heading is hidden.
   */
  public async getHeadingHidden(): Promise<boolean> {
    return await ((
      await this.#getHeadingWrapper()
    )?.hasClass('sky-screen-reader-only') ?? true);
  }

  /**
   * The semantic heading level used for the radio group. Returns undefined if heading level is not set.
   */
  public async getHeadingLevel(): Promise<
    SkyRadioGroupHeadingLevel | undefined
  > {
    const h3 = await this.#getLegendH3();
    const h4 = await this.#getLegendH4();
    const h5 = await this.#getLegendH5();

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
      (await this.#getLegendH3()) ||
      (await this.#getLegendH4()) ||
      (await this.#getLegendH5()) ||
      (await this.#getLegendDefault());

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
    return await ((await this.#getLegendHeading())?.text() ?? '');
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
   * Gets a specific radio button that meets certain criteria.
   */
  public async getRadioButton(
    filter: SkyRadioHarnessFilters,
  ): Promise<SkyRadioHarness> {
    return await this.locatorFor(SkyRadioHarness.with(filter))();
  }

  /**
   * Gets an array of harnesses for the radio buttons in the radio group.
   */
  public async getRadioButtons(
    filters?: SkyRadioHarnessFilters,
  ): Promise<SkyRadioHarness[]> {
    const radioButtons = await this.locatorForAll(
      SkyRadioHarness.with(filters || {}),
    )();

    if (radioButtons.length === 0 && filters) {
      throw new Error(
        `Unable to find any radio buttons with filter(s): ${JSON.stringify(filters)}`,
      );
    }

    return radioButtons;
  }

  /**
   * Whether the radio group is required.
   */
  public async getRequired(): Promise<boolean> {
    const headingWrapper = await this.#getHeading();

    return await headingWrapper.hasClass('sky-control-label-required');
  }

  /**
   * Whether the radio group is stacked.
   */
  public async getStacked(): Promise<boolean> {
    const host = await this.host();
    const heading =
      (await this.#getLegendH3()) ||
      (await this.#getLegendH4()) ||
      (await this.#getLegendH5());
    const label = await this.#getLegendDefault();

    return (
      ((await host.hasClass('sky-form-field-stacked')) && !!label) ||
      ((await host.hasClass('sky-field-group-stacked')) && !!heading)
    );
  }

  /**
   * Whether the radio group has errors.
   */
  public async hasError(errorName: string): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError(errorName);
  }

  async #getFormErrors(): Promise<SkyFormErrorsHarness> {
    return await this.locatorFor(SkyFormErrorsHarness)();
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(
      SkyHelpInlineHarness.with({
        ancestor: '.sky-radio-group > .sky-radio-group-legend',
      }),
    )();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
