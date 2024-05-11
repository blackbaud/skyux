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
  // public calculators$ = signal<SkyDateRangeCalculator[]>([]);

  // #calculators: SkyDateRangeCalculator[] = [];

  // readonly #resourcesSvc = inject(SkyLibResourcesService);

  // constructor() {
  //   this.#createDefaultCalculators();
  // }

  // public filterByIds(calculatorIds: string): void {}

  // #createDefaultCalculators(): void {
  //   const resourceStrings: Record<number, string> = {};

  //   for (const defaultConfig of SKY_DEFAULT_CALCULATOR_CONFIGS) {
  //     resourceStrings[defaultConfig.calculatorId] =
  //       defaultConfig.shortDescriptionResourceKey;

  //     this.#calculators.push(
  //       new SkyDateRangeCalculator(defaultConfig.calculatorId, {
  //         getValue: defaultConfig.getValue,
  //         shortDescription: '',
  //         type: defaultConfig.type,
  //         validate: defaultConfig.validate,
  //       }),
  //     );
  //   }

  //   this.#resourcesSvc.getStrings(resourceStrings).subscribe((v) => {
  //     this.#updateCalculatorDescriptions(v);
  //   });
  // }

  // #updateCalculatorDescriptions(values: Record<number, string>): void {
  //   this.#calculators.forEach((calculator) => {
  //     const newDescription = values[calculator.calculatorId];

  //     if (newDescription) {
  //       calculator.shortDescription = newDescription;
  //     }
  //   });

  //   this.calculators$.set(this.#calculators);
  // }

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
    return this.#calculators.filter((calculator) =>
      calculatorIds.includes(calculator.calculatorId),
    );
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
