import { TestBed } from '@angular/core/testing';
import { SkyLibResourcesService } from '@skyux/i18n';

import { firstValueFrom, of } from 'rxjs';

import { SkyDateRangePickerModule } from '../date-range-picker.module';

import { SkyDateRangeCalculation } from './date-range-calculation';
import { SkyDateRangeCalculator } from './date-range-calculator';
import { SkyDateRangeCalculatorId } from './date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './date-range-calculator-type';

describe('SkyDateRangeCalculator', () => {
  let resourcesSvc: SkyLibResourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyDateRangePickerModule],
    });

    resourcesSvc = TestBed.inject(SkyLibResourcesService);
  });

  it('should return the static shortDescription before resolving the resources string', async () => {
    const calculator = new SkyDateRangeCalculator(
      SkyDateRangeCalculatorId.After,
      {
        getValue(): SkyDateRangeCalculation {
          return {
            calculatorId: 999 as SkyDateRangeCalculatorId,
            startDate: new Date(),
          };
        },
        shortDescription: 'My static short description',
        type: SkyDateRangeCalculatorType.After,
      },
      resourcesSvc,
      'my_resources_string',
    );

    const spy = spyOn(resourcesSvc, 'getString').and.callThrough();

    await expectAsync(
      firstValueFrom(calculator.shortDescription$),
    ).toBeResolvedTo('My static short description');

    expect(spy).not.toHaveBeenCalled();
  });

  it('should return the resolved resources string if shortDescription undefined', async () => {
    const calculator = new SkyDateRangeCalculator(
      SkyDateRangeCalculatorId.After,
      {
        getValue(): SkyDateRangeCalculation {
          return {
            calculatorId: 999 as SkyDateRangeCalculatorId,
            startDate: new Date(),
          };
        },
        shortDescription: '', // <-- important
        type: SkyDateRangeCalculatorType.After,
      },
      resourcesSvc,
      'my_resources_string',
    );

    spyOn(resourcesSvc, 'getString').and.returnValue(
      of('My resolved short description'),
    );

    await expectAsync(
      firstValueFrom(calculator.shortDescription$),
    ).toBeResolvedTo('My resolved short description');
  });

  it('should throw if neither shortDescription or resources key defined', () => {
    const calculator = new SkyDateRangeCalculator(
      SkyDateRangeCalculatorId.After,
      {
        getValue(): SkyDateRangeCalculation {
          return {
            calculatorId: 999 as SkyDateRangeCalculatorId,
            startDate: new Date(),
          };
        },
        shortDescription: '', // <-- important
        type: SkyDateRangeCalculatorType.After,
      },
      resourcesSvc,
      undefined, // <-- important
    );

    expect(() => calculator.shortDescription$).toThrowError(
      'Calculator created without short description or resource key.',
    );
  });
});
