import { Injectable } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorConfig } from './types/date-range-calculator-config';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SKY_DEFAULT_CALCULATOR_CONFIGS } from './types/date-range-default-calculator-configs';

/**
 * Creates and manages `SkyDateRangeCalculator` instances.
 */
@Injectable()
export class SkyDateRangeService {
  // Start the count higher than the number of available values
  // provided in the SkyDateRangeCalculatorId enum.
  private static lastId = 1000;

  private calculatorReadyStream = new BehaviorSubject<boolean>(false);

  private calculatorConfigs: { [id: number]: SkyDateRangeCalculatorConfig } =
    {};

  private calculators: SkyDateRangeCalculator[] = [];

  constructor(private resourcesService: SkyLibResourcesService) {
    this.createDefaultCalculators();
  }

  /**
   * Creates a custom date range calculator.
   * @param config The calculator config.
   */
  public createCalculator(
    config: SkyDateRangeCalculatorConfig
  ): SkyDateRangeCalculator {
    const newId = SkyDateRangeService.lastId++;
    const calculator = new SkyDateRangeCalculator(newId, config);

    this.calculators.push(calculator);

    return calculator;
  }

  /**
   * Returns calculators from an array of calculator IDs.
   * @param ids The array of calculator IDs.
   */
  public getCalculators(
    ids: SkyDateRangeCalculatorId[]
  ): Promise<SkyDateRangeCalculator[]> {
    const promises = ids.map((id) => {
      return this.getCalculatorById(id);
    });

    return Promise.all(promises);
  }

  /**
   * Returns a calculator from a calculator ID.
   * @param id The calculator ID.
   */
  public getCalculatorById(
    id: SkyDateRangeCalculatorId
  ): Promise<SkyDateRangeCalculator> {
    const calculatorId = parseInt(id as any, 10);
    const found = this.calculators.find((calculator) => {
      return calculator.calculatorId === calculatorId;
    });

    return new Promise((resolve, reject) => {
      if (!found) {
        reject(new Error(`A calculator with the ID ${id} was not found.`));
        return;
      }

      this.calculatorReadyStream.pipe(first()).subscribe(() => {
        resolve(found);
      });
    });
  }

  private createDefaultCalculators(): void {
    const tasks: Observable<void>[] = [];

    // Get resource strings for short descriptions.
    SKY_DEFAULT_CALCULATOR_CONFIGS.forEach((defaultConfig) => {
      const config = {
        getValue: defaultConfig.getValue,
        validate: defaultConfig.validate,
        shortDescription: '',
        type: defaultConfig.type,
      };

      tasks.push(
        this.resourcesService
          .getString(defaultConfig.shortDescriptionResourceKey)
          .pipe(
            first(),
            map((value) => {
              config.shortDescription = value;
            })
          )
      );

      this.calculatorConfigs[defaultConfig.calculatorId] = config;
    });

    forkJoin(tasks)
      .pipe(first())
      .subscribe(() => {
        const calculatorIds = Object.keys(this.calculatorConfigs);
        const calculators = calculatorIds.map((calculatorId) => {
          const id = parseInt(calculatorId, 10);
          return new SkyDateRangeCalculator(id, this.calculatorConfigs[id]);
        });

        this.calculators = calculators;
        this.calculatorReadyStream.next(true);
      });
  }
}
