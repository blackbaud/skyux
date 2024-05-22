import { Injectable, OnDestroy } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { BehaviorSubject, Observable, Subject, forkJoin } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';

import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorConfig } from './types/date-range-calculator-config';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SKY_DEFAULT_CALCULATOR_CONFIGS } from './types/date-range-default-calculator-configs';

/**
 * Creates and manages `SkyDateRangeCalculator` instances.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyDateRangeService implements OnDestroy {
  public get calculators(): SkyDateRangeCalculator[] {
    return this.#calculators;
  }

  // Start the count higher than the number of available values
  // provided in the SkyDateRangeCalculatorId enum.
  private static lastId = 1000;

  #calculatorReadyStream = new BehaviorSubject<boolean>(false);

  #calculators: SkyDateRangeCalculator[] = [];

  #ngUnsubscribe = new Subject<void>();

  #resourcesService: SkyLibResourcesService;

  constructor(resourcesService: SkyLibResourcesService) {
    this.#resourcesService = resourcesService;
    this.#calculators = this.#createDefaultCalculators();
    this.#resolveResourcesStrings(this.#calculators);
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * Creates a custom date range calculator.
   * @param config The calculator config.
   */
  public createCalculator(
    config: SkyDateRangeCalculatorConfig,
  ): SkyDateRangeCalculator {
    const newId = SkyDateRangeService.lastId++;
    const calculator = new SkyDateRangeCalculator(newId, config);

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

      this.#calculatorReadyStream.pipe(first()).subscribe(() => {
        resolve(found);
      });
    });
  }

  /**
   * Returns default date range calculators with unresolved resources strings.
   */
  #createDefaultCalculators(): SkyDateRangeCalculator[] {
    const calculators: SkyDateRangeCalculator[] = [];

    for (const defaultConfig of SKY_DEFAULT_CALCULATOR_CONFIGS) {
      calculators.push(
        new SkyDateRangeCalculator(defaultConfig.calculatorId, {
          getValue: defaultConfig.getValue,
          validate: defaultConfig.validate,
          shortDescription: '',
          _shortDescriptionResourceKey:
            defaultConfig.shortDescriptionResourceKey,
          type: defaultConfig.type,
        }),
      );
    }

    return calculators;
  }

  /**
   * Resolves locale resources strings for the provided calculators.
   * @deprecated The resources strings are resolved in the template, so we'll
   * remove this functionality in a later major version of SKY UX.
   */
  #resolveResourcesStrings(calculators: SkyDateRangeCalculator[]): void {
    const tasks: Observable<void>[] = [];

    calculators.forEach((calculator) => {
      if (calculator._shortDescriptionResourceKey) {
        tasks.push(
          this.#resourcesService
            .getString(calculator._shortDescriptionResourceKey)
            .pipe(
              takeUntil(this.#ngUnsubscribe),
              map((value) => {
                calculator.shortDescription = value;
              }),
            ),
        );
      }
    });

    forkJoin(tasks)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#calculatorReadyStream.next(true);
      });
  }
}
