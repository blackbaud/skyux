import { TestBed } from '@angular/core/testing';

import { SkyDateRangeService } from './date-range.service';
import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';

describe('Date range service', () => {
  let service: SkyDateRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(SkyDateRangeService);
  });

  it('should return a calculator by ID', () => {
    service.getCalculatorById(SkyDateRangeCalculatorId.After).then((result) => {
      expect(result instanceof SkyDateRangeCalculator).toEqual(true);
      expect(result.calculatorId).toEqual(SkyDateRangeCalculatorId.After);
      expect(result.type).toEqual(SkyDateRangeCalculatorType.After);
      expect(result._shortDescriptionResourceKey).toEqual(
        'skyux_date_range_picker_format_label_after',
      );
      expect(typeof result.getValue).toEqual('function');
      expect(typeof result.validate).toEqual('function');
    });
  });

  it('should return calculators given an array of IDs', () => {
    service.getCalculators([SkyDateRangeCalculatorId.After]).then((result) => {
      expect(result[0] instanceof SkyDateRangeCalculator).toEqual(true);
      expect(result[0].calculatorId).toEqual(SkyDateRangeCalculatorId.After);
      expect(result[0].type).toEqual(SkyDateRangeCalculatorType.After);
      expect(result[0]._shortDescriptionResourceKey).toEqual(
        'skyux_date_range_picker_format_label_after',
      );
      expect(typeof result[0].getValue).toEqual('function');
      expect(typeof result[0].validate).toEqual('function');
    });
  });

  it('should handle calculator not found', () => {
    service
      .getCalculatorById(5000 as SkyDateRangeCalculatorId)
      .catch((error) => {
        expect(error.message).toEqual(
          'A calculator with the ID 5000 was not found.',
        );
      });
  });

  it('should create custom calculators', () => {
    const expectedValue = new Date('1/1/2001');
    const calculator = service.createCalculator({
      shortDescription: 'My calculator',
      type: SkyDateRangeCalculatorType.Relative,
      getValue: () => {
        return { startDate: expectedValue };
      },
    });

    expect(calculator.calculatorId).toEqual(1000 as SkyDateRangeCalculatorId);
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

  it('should increment the IDs if multiple calculators are created', () => {
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

    expect(calculator1.calculatorId).toEqual(1001 as SkyDateRangeCalculatorId);
    expect(calculator2.calculatorId).toEqual(1002 as SkyDateRangeCalculatorId);
  });

  describe('synchronous methods', () => {
    it('should filter calculators given an array of IDs', () => {
      const calculators = service.filterCalculators([
        SkyDateRangeCalculatorId.After,
        SkyDateRangeCalculatorId.Before,
      ]);

      expect(calculators[0]._shortDescriptionResourceKey).toEqual(
        'skyux_date_range_picker_format_label_after',
      );

      expect(calculators[1]._shortDescriptionResourceKey).toEqual(
        'skyux_date_range_picker_format_label_before',
      );

      expect(service.calculators.length).toEqual(22);
    });
  });
});
