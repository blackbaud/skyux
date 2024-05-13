import { Injectable, inject, signal } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Observable, forkJoin } from 'rxjs';

import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SKY_DEFAULT_CALCULATOR_CONFIGS } from './types/date-range-default-calculator-configs';

@Injectable({
  providedIn: 'root',
})
export class SkyDateRangePickerService {
  public get calculators(): SkyDateRangeCalculator[] {
    return this.#calculators;
  }

  #calculators: SkyDateRangeCalculator[] = [];

  constructor() {
    this.#calculators = this.#createDefaultCalculators();
  }

  public filterCalculators(
    calculatorIds: SkyDateRangeCalculatorId[],
  ): SkyDateRangeCalculator[] {
    const filtered: SkyDateRangeCalculator[] = [];

    for (const calculatorId of calculatorIds) {
      const found = this.#calculators.find(
        (c) => c.calculatorId === calculatorId,
      );

      if (found) {
        filtered.push(found);
      }
    }

    return filtered;
  }

  #createDefaultCalculators(): SkyDateRangeCalculator[] {
    const calculators: SkyDateRangeCalculator[] = [];

    for (const defaultConfig of SKY_DEFAULT_CALCULATOR_CONFIGS) {
      calculators.push(
        new SkyDateRangeCalculator(defaultConfig.calculatorId, {
          getValue: defaultConfig.getValue,
          validate: defaultConfig.validate,
          shortDescription: '',
          shortDescriptionResourceKey:
            defaultConfig.shortDescriptionResourceKey,
          type: defaultConfig.type,
        }),
      );
    }

    return calculators;
  }
}
