import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyDatepickerHarness } from '@skyux/datetime/testing';
import { SkyFormErrorsHarness, SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyDateRangePickerFilters } from './date-range-picker-harness.filters';

export class SkyDateRangePickerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-date-range-picker';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDatepickerHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDateRangePickerFilters,
  ): HarnessPredicate<SkyDateRangePickerHarness> {
    return SkyDateRangePickerHarness.getDataSkyIdPredicate(filters);
  }

  public async getPickerHarness(): Promise<SkyInputBoxHarness> {
    return await this.locatorFor(
      SkyInputBoxHarness.with({
        ancestor: '.sky-date-range-picker-select-field',
      }),
    )();
  }

  public async getStartDateDatepicker(): Promise<SkyDatepickerHarness> {
    return (
      await this.locatorFor(
        SkyInputBoxHarness.with({
          ancestor: '.sky-date-range-picker-start-date',
        }),
      )()
    ).queryHarness(SkyDatepickerHarness);
  }

  public async getEndDateDatepicker(): Promise<SkyDatepickerHarness> {
    return (
      await this.locatorFor(
        SkyInputBoxHarness.with({
          ancestor: '.sky-date-range-picker-end-date',
        }),
      )()
    ).queryHarness(SkyDatepickerHarness);
  }

  /**
   * Gets the date range picker component's label text.
   */
  public async getLabelText(): Promise<string> {
    return (await this.getPickerHarness()).getLabelText();
  }

  /**
   * Whether the date range picker component is disabled
   */
  public async isDisabled(): Promise<boolean> {
    return;
  }
}
