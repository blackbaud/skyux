import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDateRangePickerCalculatorOptionHarnessFilters } from './date-range-picker-calculator-option-harness.filters';

/**
 * @internal
 */
export class SkyDateRangePickerCalculatorOptionHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector =
    'select[formControlName="calculatorId"] > option';

  public static with(
    filters: SkyDateRangePickerCalculatorOptionHarnessFilters,
  ): HarnessPredicate<SkyDateRangePickerCalculatorOptionHarness> {
    return SkyDateRangePickerCalculatorOptionHarness.getDataSkyIdPredicate(
      filters,
    ).addOption('text', filters.text, async (harness, text) =>
      HarnessPredicate.stringMatches(await harness.getText(), text),
    );
  }

  public async getText(): Promise<string> {
    return (await this.host()).text();
  }

  public async getIndex(): Promise<number> {
    return (await this.host()).getProperty('index');
  }

  public async click(): Promise<void> {
    return (await this.host()).click();
  }
}
