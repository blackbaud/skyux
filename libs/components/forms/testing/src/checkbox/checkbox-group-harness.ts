import { HarnessPredicate } from '@angular/cdk/testing';
import { TemplateRef } from '@angular/core';
import { SkyComponentHarness } from '@skyux/core/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  SkyCheckboxGroupHeadingLevel,
  SkyCheckboxGroupHeadingStyle,
} from '@skyux/forms';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyFormErrorsHarness } from '../form-error/form-errors-harness';

import { SkyCheckboxGroupHarnessFilters } from './checkbox-group-harness-filters';
import { SkyCheckboxHarness } from './checkbox-harness';

/**
 * Harness for interacting with a checkbox group component in tests.
 * @internal
 */
export class SkyCheckboxGroupHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-checkbox-group';

  #getCheckboxes = this.locatorForAll(SkyCheckboxHarness);
  #getHintText = this.locatorForOptional('.sky-checkbox-group-hint-text');
  #getHeading = this.locatorFor('.sky-control-label');
  #getHeadingWrapper = this.locatorFor('.sky-control-label span');
  #getH3 = this.locatorForOptional('legend h3');
  #getH4 = this.locatorForOptional('legend h4');
  #getH5 = this.locatorForOptional('legend h5');
  #getHeadingText = this.locatorForOptional('legend .sky-heading-text');

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
    return (await this.#getHelpInline()).click();
  }

  /**
   * Gets an array of harnesses for the checkboxes in the checkbox group.
   */
  public async getCheckboxes(): Promise<SkyCheckboxHarness[]> {
    return await this.#getCheckboxes();
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
   * Gets the checkbox group's heading text. If `headingHidden` is true,
   * the text will still be returned.
   */
  public async getHeadingText(): Promise<string | undefined> {
    return (await this.#getHeading()).text();
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
    return (await this.#getHeading()).hasClass('sky-screen-reader-only');
  }

  /**
   * The semantic heading level used for the checkbox group. Returns undefined if heading level is not set.
   */
  public async getHeadingLevel(): Promise<
    SkyCheckboxGroupHeadingLevel | undefined
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
   * The heading style used for the checkbox group.
   */
  public async getHeadingStyle(): Promise<SkyCheckboxGroupHeadingStyle> {
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
   * Whether the checkbox group is required.
   */
  public async getRequired(): Promise<boolean> {
    const headingWrapper = await this.#getHeadingWrapper();

    return await headingWrapper.hasClass('sky-control-label-required');
  }

  /**
   * Whether the checkbox group is stacked.
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
   * Whether all the checkboxes in a required group are unchecked.
   */
  public async hasRequiredError(): Promise<boolean> {
    return (await this.#getFormErrors()).hasError('required');
  }

  /**
   * Whether the checkbox group has errors.
   */
  public async hasError(errorName: string): Promise<boolean> {
    return (await this.#getFormErrors()).hasError(errorName);
  }

  async #getFormErrors(): Promise<SkyFormErrorsHarness> {
    const errorsHarness = await this.locatorFor(
      SkyFormErrorsHarness.with({
        dataSkyId: 'checkbox-group-form-errors',
      }),
    )();

    // Defer making a breaking change to this harness by throwing an error if no errors are found.
    const errors = await errorsHarness.getFormErrors();

    if (errors.length) {
      return errorsHarness;
    }

    throw Error('No form errors found.');
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(
      SkyHelpInlineHarness.with({
        ancestor: '.sky-checkbox-group > .sky-control-label',
      }),
    )();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
