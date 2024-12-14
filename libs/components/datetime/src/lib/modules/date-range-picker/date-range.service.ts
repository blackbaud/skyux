import { Injectable, inject } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorConfig } from './types/date-range-calculator-config';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SKY_DEFAULT_CALCULATOR_CONFIGS } from './types/date-range-default-calculator-configs';

// Start the count higher than the number of available values
// provided in the SkyDateRangeCalculatorId enum.
let lastId = 1000;

/**
 * Creates and manages `SkyDateRangeCalculator` instances.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyDateRangeService {
  readonly #libResourcesSvc = inject(SkyLibResourcesService);

  public get calculators(): SkyDateRangeCalculator[] {
    return this.#calculators;
  }

  #calculators = this.#createDefaultCalculators();

  /**
   * Creates a custom date range calculator.
   * @param config The calculator config.
   */
  public createCalculator(
    config: SkyDateRangeCalculatorConfig,
  ): SkyDateRangeCalculator {
    const newId = lastId++;
    const calculator = new SkyDateRangeCalculator(
      newId,
      config,
      this.#libResourcesSvc,
    );

    this.#calculators.push(calculator);

    return calculator;
  }

  /**
   * Returns calculators from an array of calculator IDs.
   * @param calculatorIds The array of calculator IDs.
   */
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

  /**
   * Returns calculators from an array of calculator IDs.
   * @param ids The array of calculator IDs.
   * @deprecated Call `filterCalculators()` instead.
   */
  public getCalculators(
    ids: SkyDateRangeCalculatorId[],
  ): Promise<SkyDateRangeCalculator[]> {
    const promises = ids.map((id) => {
      return this.getCalculatorById(id);
    });

    return Promise.all(promises);
  }

  /**
   * Returns a calculator from a calculator ID.
   * @param id The calculator ID.
   * @deprecated Call `filterCalculators()` instead.
   */
  public getCalculatorById(
    id: SkyDateRangeCalculatorId,
  ): Promise<SkyDateRangeCalculator> {
    const calculatorId = +id;

    const found = this.#calculators.find((calculator) => {
      return calculator.calculatorId === calculatorId;
    });

    return new Promise((resolve, reject) => {
      if (!found) {
        reject(new Error(`A calculator with the ID ${id} was not found.`));
        return;
      }

      resolve(found);
    });
  }

  /**
   * Returns default date range calculators with unresolved resources strings.
   */
  #createDefaultCalculators(): SkyDateRangeCalculator[] {
    const calculators: SkyDateRangeCalculator[] = [];

    for (const defaultConfig of SKY_DEFAULT_CALCULATOR_CONFIGS) {
      calculators.push(
        new SkyDateRangeCalculator(
          defaultConfig.calculatorId,
          {
            getValue: defaultConfig.getValue,
            validate: defaultConfig.validate,
            shortDescription: '',
            type: defaultConfig.type,
          },
          this.#libResourcesSvc,
          defaultConfig.shortDescriptionResourceKey,
        ),
      );
    }

    return calculators;
  }
}
