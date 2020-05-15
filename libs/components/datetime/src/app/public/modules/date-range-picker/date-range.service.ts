import {
  Injectable
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  BehaviorSubject,
  forkJoin,
  Observable
} from 'rxjs';

import {
  first,
  map
} from 'rxjs/operators';

import {
  SkyDateRangeCalculatorConfig
} from './types/date-range-calculator-config';

import {
  SkyDateRangeCalculatorId
} from './types/date-range-calculator-id';

import {
  SkyDateRangeCalculator
} from './types/date-range-calculator';

import {
  SKY_DEFAULT_CALCULATOR_CONFIGS
} from './types/date-range-default-calculator-configs';

@Injectable()
export class SkyDateRangeService {

  // Start the count higher than the number of available values
  // provided in the SkyDateRangeCalculatorId enum.
  private static lastId = 1000;

  private calculatorReadyStream = new BehaviorSubject<boolean>(false);
  private calculatorConfigs: {[id: number]: SkyDateRangeCalculatorConfig} = {};
  private calculators: SkyDateRangeCalculator[] = [];

  constructor(
    private resourcesService: SkyLibResourcesService
  ) {
    this.createDefaultCalculators();
  }

  public createCalculator(config: SkyDateRangeCalculatorConfig): SkyDateRangeCalculator {
    const newId = SkyDateRangeService.lastId++;
    const calculator = new SkyDateRangeCalculator(newId, config);

    this.calculators.push(calculator);

    return calculator;
  }

  public getCalculators(ids: SkyDateRangeCalculatorId[]): Promise<SkyDateRangeCalculator[]> {
    const promises = ids.map((id) => {
      return this.getCalculatorById(id);
    });

    return Promise.all(promises);
  }

  public getCalculatorById(id: SkyDateRangeCalculatorId): Promise<SkyDateRangeCalculator> {
    const calculatorId = parseInt(id as any, 10);
    const found = this.calculators.find((calculator) => {
      return (calculator.calculatorId === calculatorId);
    });

    return new Promise((resolve, reject) => {
      if (!found) {
        reject(
          new Error(`A calculator with the ID ${id} was not found.`)
        );
        return;
      }

      this.calculatorReadyStream
        .pipe(first())
        .subscribe(() => {
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
        type: defaultConfig.type
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
