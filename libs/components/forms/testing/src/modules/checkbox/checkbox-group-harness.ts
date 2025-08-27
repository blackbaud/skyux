import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  SkyCheckboxGroupHeadingLevel,
  SkyCheckboxGroupHeadingStyle,
} from '@skyux/forms';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyFormErrorsHarness } from '../form-error/form-errors-harness';

import { SkyCheckboxGroupHarnessFilters } from './checkbox-group-harness-filters';
import { SkyCheckboxHarness } from './checkbox-harness';
import { SkyCheckboxHarnessFilters } from './checkbox-harness-filters';

/**
 * Harness for interacting with a checkbox group component in tests.
 */
export class SkyCheckboxGroupHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-checkbox-group';

  #getHeading = this.locatorFor('.sky-checkbox-group-heading');
  #getHeadingWrapper = this.locatorFor('.sky-checkbox-group-legend');
  #getHintText = this.locatorForOptional('.sky-checkbox-group-hint-text');
  #getLegendDefault = this.locatorForOptional(
    'legend .sky-checkbox-group-heading-text',
  );
  #getLegendH3 = this.locatorForOptional('legend h3');
  #getLegendH4 = this.locatorForOptional('legend h4');
  #getLegendH5 = this.locatorForOptional('legend h5');
  #getLegendHeading = this.locatorFor(
    'legend h3,h4,h5,.sky-checkbox-group-heading-text',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyCheckboxGroupHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyCheckboxGroupHarnessFilters,
  ): HarnessPredicate<SkyCheckboxGroupHarness> {
    return SkyCheckboxGroupHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    await (await this.#getHelpInline()).click();
  }

  /**
   * Gets a specific checkbox that meets certain criteria.
   */
  public async getCheckbox(
    filter: SkyCheckboxHarnessFilters,
  ): Promise<SkyCheckboxHarness> {
    return await this.locatorFor(SkyCheckboxHarness.with(filter))();
  }

  /**
   * Gets an array of checkboxes in the checkbox group.
   */
  public async getCheckboxes(
    filters?: SkyCheckboxHarnessFilters,
  ): Promise<SkyCheckboxHarness[]> {
    return await this.locatorForAll(SkyCheckboxHarness.with(filters || {}))();
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
   * Gets the checkbox group's heading text. If `headingHidden` is true,
   * the text will still be returned.
   */
  public async getHeadingText(): Promise<string | undefined> {
    return await (await this.#getLegendHeading()).text();
  }

  /**
   * Gets the checkbox group's hint text.
   */
  public async getHintText(): Promise<string> {
    const hintText = await this.#getHintText();

    return (await hintText?.text())?.trim() ?? '';
  }

  /**
   * Whether the heading is hidden.
   */
  public async getHeadingHidden(): Promise<boolean> {
    return await (
      await this.#getHeadingWrapper()
    ).hasClass('sky-screen-reader-only');
  }

  /**
   * The semantic heading level used for the checkbox group. Returns undefined if heading level is not set.
   */
  public async getHeadingLevel(): Promise<
    SkyCheckboxGroupHeadingLevel | undefined
  > {
    const heading = await this.#getLegendHeading();
    const h3 = await heading.matchesSelector('h3');
    const h4 = await heading.matchesSelector('h4');
    const h5 = await heading.matchesSelector('h5');

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
   * The heading style used for the checkbox group.
   */
  public async getHeadingStyle(): Promise<SkyCheckboxGroupHeadingStyle> {
    const heading = await this.#getLegendHeading();

    const isHeadingStyle3 = await heading.hasClass('sky-font-heading-3');
    const isHeadingStyle4 = await heading.hasClass('sky-font-heading-4');

    if (isHeadingStyle3) {
      return 3;
    } else if (isHeadingStyle4) {
      return 4;
    } else {
      return 5;
    }
  }

  /**
   * Whether the checkbox group is required.
   */
  public async getRequired(): Promise<boolean> {
    const heading = await this.#getHeading();

    return await heading.hasClass('sky-control-label-required');
  }

  /**
   * Whether the checkbox group is stacked.
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
   * Whether all the checkboxes in a required group are unchecked.
   */
  public async hasRequiredError(): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError('required');
  }

  /**
   * Whether the checkbox group has errors.
   */
  public async hasError(errorName: string): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError(errorName);
  }

  async #getFormErrors(): Promise<SkyFormErrorsHarness> {
    return await this.locatorFor(
      SkyFormErrorsHarness.with({
        dataSkyId: 'checkbox-group-form-errors',
      }),
    )();
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(
      SkyHelpInlineHarness.with({
        ancestor: '.sky-checkbox-group > .sky-checkbox-group-legend',
      }),
    )();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
