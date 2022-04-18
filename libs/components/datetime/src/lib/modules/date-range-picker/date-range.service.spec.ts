import { TestBed } from '@angular/core/testing';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyDateRangeService } from './date-range.service';
import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';

describe('Date range service', function () {
  let service: SkyDateRangeService;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [SkyI18nModule, SkyDatetimeResourcesModule],
      providers: [SkyDateRangeService],
    });

    service = TestBed.inject(SkyDateRangeService);
  });

  it('should return a calculator by ID', function () {
    service.getCalculatorById(SkyDateRangeCalculatorId.After).then((result) => {
      expect(result instanceof SkyDateRangeCalculator).toEqual(true);
      expect(result.calculatorId).toEqual(SkyDateRangeCalculatorId.After);
      expect(result.type).toEqual(SkyDateRangeCalculatorType.After);
      expect(result.shortDescription).toEqual('After');
      expect(typeof result.getValue).toEqual('function');
      expect(typeof result.validate).toEqual('function');
    });
  });

  it('should return calculators given an array of IDs', function () {
    service.getCalculators([SkyDateRangeCalculatorId.After]).then((result) => {
      expect(result[0] instanceof SkyDateRangeCalculator).toEqual(true);
      expect(result[0].calculatorId).toEqual(SkyDateRangeCalculatorId.After);
      expect(result[0].type).toEqual(SkyDateRangeCalculatorType.After);
      expect(result[0].shortDescription).toEqual('After');
      expect(typeof result[0].getValue).toEqual('function');
      expect(typeof result[0].validate).toEqual('function');
    });
  });

  it('should handle calculator not found', function () {
    service.getCalculatorById(5000).catch((error) => {
      expect(error.message).toEqual(
        'A calculator with the ID 5000 was not found.'
      );
    });
  });

  it('should create custom calculators', function () {
    const expectedValue = new Date('1/1/2001');
    const calculator = service.createCalculator({
      shortDescription: 'My calculator',
      type: SkyDateRangeCalculatorType.Relative,
      getValue: () => {
        return { startDate: expectedValue };
      },
    });

    expect(calculator.calculatorId).toEqual(1000);
    expect(calculator.shortDescription).toEqual('My calculator');
    expect(calculator.type).toEqual(SkyDateRangeCalculatorType.Relative);
    expect(typeof calculator.getValue).toEqual('function');
    expect(typeof calculator.validate).toEqual('function');

    expect(calculator.getValue()).toEqual({
      calculatorId: calculator.calculatorId,
      startDate: expectedValue,
      endDate: null,
    });
  });

  it('should increment the IDs if multiple calculators are created', function () {
    // Reset the autoincremented ID.
    SkyDateRangeService['lastId'] = 1000;

    const calculator1 = service.createCalculator({
      shortDescription: 'My calculator 1',
      type: SkyDateRangeCalculatorType.Relative,
      getValue: () => ({}),
    });

    const calculator2 = service.createCalculator({
      shortDescription: 'My calculator 2',
      type: SkyDateRangeCalculatorType.Relative,
      getValue: () => ({}),
    });

    expect(calculator1.calculatorId).toEqual(1000);
    expect(calculator2.calculatorId).toEqual(1001);
  });
});
