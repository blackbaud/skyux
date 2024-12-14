import { ValidationErrors } from '@angular/forms';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Observable, of } from 'rxjs';

import { SkyDateRange } from './date-range';
import { SkyDateRangeCalculation } from './date-range-calculation';
import { SkyDateRangeCalculatorConfig } from './date-range-calculator-config';
import { SkyDateRangeCalculatorId } from './date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './date-range-calculator-type';

/**
 * Represents the calculator.
 */
export class SkyDateRangeCalculator {
  #config: SkyDateRangeCalculatorConfig;
  #resourcesSvc: SkyLibResourcesService;

  /**
   * The text to display in the calculator select menu.
   */
  public get shortDescription$(): Observable<string> {
    if (this.shortDescription) {
      return of(this.shortDescription);
    }

    if (!this.#shortDescriptionResourceKey) {
      throw new Error(
        'Calculator created without short description or resource key.',
      );
    }

    return this.#resourcesSvc.getString(this.#shortDescriptionResourceKey);
  }

  /**
   * The text to display in the calculator select menu.
   * @deprecated Subscribe to the `shortDescription$` observable instead.
   */
  public shortDescription: string;

  #shortDescriptionResourceKey: string | undefined;

  /**
   * The type of calculations available for the date range.
   */
  public readonly type: SkyDateRangeCalculatorType;

  constructor(
    /**
     * The calculator ID that specifies calculator objects that represent date ranges.
     */
    public readonly calculatorId: SkyDateRangeCalculatorId,
    config: SkyDateRangeCalculatorConfig,
    resourcesSvc: SkyLibResourcesService,
    _shortDescriptionResourceKey?: string,
  ) {
    this.#config = config;
    this.type = config.type;
    this.shortDescription = config.shortDescription;
    this.#shortDescriptionResourceKey = _shortDescriptionResourceKey;
    this.#resourcesSvc = resourcesSvc;
  }

  /**
   * Gets the current value of the calculator.
   * @param startDateInput The start date.
   * @param endDateInput The end date.
   */
  public getValue(
    startDateInput?: Date | null,
    endDateInput?: Date | null,
  ): SkyDateRangeCalculation {
    const result = this.#config.getValue(startDateInput, endDateInput);

    let startDate: Date | null = null;
    if (result.startDate instanceof Date) {
      startDate = this.#parseDateWithoutTime(result.startDate);
    }

    let endDate: Date | null = null;
    if (result.endDate instanceof Date) {
      endDate = this.#parseDateWithoutTime(result.endDate);
    }

    return {
      calculatorId: this.calculatorId,
      startDate,
      endDate,
    };
  }

  /**
   * Performs synchronous validation against the control.
   */
  public validate(value?: SkyDateRange): ValidationErrors | null {
    if (!this.#config.validate) {
      return null;
    }

    return this.#config.validate(value);
  }

  /**
   * Get a date object without time information.
   * See: https://stackoverflow.com/a/38050824/6178885
   */
  #parseDateWithoutTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
