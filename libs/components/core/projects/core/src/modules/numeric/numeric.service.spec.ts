import {
  inject,
  TestBed
} from '@angular/core/testing';

import {
  SkyIntlNumberFormatStyle,
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyNumberFormatUtility
} from '../shared/number-format/number-format-utility';

import {
  SkyNumericModule
} from './numeric.module';

import {
  NumericOptions
} from './numeric.options';

import {
  SkyNumericService
} from './numeric.service';

describe('Numeric service', () => {
  let skyNumeric: SkyNumericService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyNumericModule
      ]
    });
  });

  beforeEach(inject([SkyLibResourcesService], (resourcesService: SkyLibResourcesService) => {
    skyNumeric = new SkyNumericService(resourcesService);
  }));

  it('formats 0 with 0 digits as 0', () => {
    const value = 0;
    const options = new NumericOptions();
    options.digits = 0;

    expect(skyNumeric.formatNumber(value, options)).toBe('0');
  });

  it('formats undefined as blank', () => {
    const value: any = undefined;
    const options = new NumericOptions();
    options.digits = 0;

    expect(skyNumeric.formatNumber(value, options)).toBe('');
  });

  it('formats 100 with 0 digits as 100', () => {
    const value = 100;
    const options = new NumericOptions();
    options.digits = 0;

    expect(skyNumeric.formatNumber(value, options)).toBe('100');
  });

  it('formats 1000 with 0 digits as 1K', () => {
    const value = 1000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1K');
  });

  it('does not truncate 1000 with 2 digits as 1K when truncate is false', () => {
    const value = 1000;
    const options = new NumericOptions();
    options.digits = 2;
    options.truncate = false;
    expect(skyNumeric.formatNumber(value, options)).toBe('1,000.00');
  });

  it('formats 1000000 with 0 digits as 1M', () => {
    const value = 1000000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1M');
  });

  it('does not truncate 1000000 with 2 digits as 1M when truncate is false', () => {
    const value = 1000000;
    const options = new NumericOptions();
    options.digits = 2;
    options.truncate = false;
    expect(skyNumeric.formatNumber(value, options)).toBe('1,000,000.00');
  });

  it('formats 1000000000 with 0 digits as 1B', () => {
    const value = 1000000000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1B');
  });

  it('does not truncate 1000000000 with 2 digits as 1B when truncate is false', () => {
    const value = 1000000000;
    const options = new NumericOptions();
    options.digits = 2;
    options.truncate = false;
    expect(skyNumeric.formatNumber(value, options)).toBe('1,000,000,000.00');
  });

  it('formats 1000000000000 with 0 digits as 1T', () => {
    const value = 1000000000000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1T');
  });

  it('does not truncate 1000000000000 with 2 digits as 1T when truncate is false', () => {
    const value = 1000000000000;
    const options = new NumericOptions();
    options.digits = 2;
    options.truncate = false;
    expect(skyNumeric.formatNumber(value, options)).toBe('1,000,000,000,000.00');
  });

  it('formats 999000000 as 999M', () => {
    const value = 999000000;
    const options = new NumericOptions();
    options.digits = 2;
    expect(skyNumeric.formatNumber(value, options)).toBe('999M');
  });

  it('should format 99 as 99', () => {
    const value = 99;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('99');
  });

  it('should format -99 as -99', () => {
    const value = -99;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('-99');
  });

  it('should format 999 as 999', () => {
    const value = 999;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('999');
  });

  it('should format -999 as -999', () => {
    const value = -999;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('-999');
  });

  it('should format 999.9 with 0 digits as 1K', () => {
    const value = 999.9;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1K');
  });

  it('should format -999.9 with 0 digits as -1K', () => {
    const value = -999.9;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('-1K');
  });

  it('should format 999999 as 1M', () => {
    const value = 999999;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('1M');
  });

  it('should format -999999 as -1M', () => {
    const value = -999999;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('-1M');
  });

  it('should format 999999999 as 1B', () => {
    const value = 999999999;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('1B');
  });

  it('should format -999999999 as -1B', () => {
    const value = -999999999;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('-1B');
  });

  it('should format 999999999999 as 1T', () => {
    const value = 999999999999;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('1T');
  });

  it('should format -999999999999 as -1T', () => {
    const value = -999999999999;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('-1T');
  });

  it('should format 999999999999999 as 1,000T', () => {
    const value = 999999999999999;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('1,000T');
  });

  it('formats 1234000 with 2 digits as 1.23M', () => {
    const value = 1234000;
    const options = new NumericOptions();
    options.digits = 2;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.23M');
  });

  it('formats 1235000 with 2 digits as 1.24M', () => {
    const value = 1235000;
    const options = new NumericOptions();
    options.digits = 2;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.24M');
  });

  it('formats 1450 with 1 digits as 1.5K', () => {
    const value = 1450;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.5K');
  });

  it('formats 1000 as US dollar with 0 digits as $1K', () => {
    const value = 1000;
    const options = new NumericOptions();
    options.digits = 0;
    options.iso = 'USD';
    options.format = 'currency';
    expect(skyNumeric.formatNumber(value, options)).toBe('$1K');
  });

  it('formats 1450 as US dollar with 1 digits as $1.5K', () => {
    const value = 1450;
    const options = new NumericOptions();
    options.digits = 1;
    options.iso = 'USD';
    options.format = 'currency';
    expect(skyNumeric.formatNumber(value, options)).toBe('$1.5K');
  });

  it('formats 1450 as US dollar with 2 minDigits as $1.5K', () => {
    const value = 1450;
    const options = new NumericOptions();
    options.digits = 2;
    options.minDigits = 2;
    options.iso = 'USD';
    options.format = 'currency';
    expect(skyNumeric.formatNumber(value, options)).toBe('$1.45K');
  });

  it('formats 1500 as Euro with 1 digits as €1.5K', () => {
    const value = 1500;
    const options = new NumericOptions();
    options.digits = 1;
    options.iso = 'EUR';
    options.format = 'currency';
    expect(skyNumeric.formatNumber(value, options)).toBe('€1.5K');
  });

  it('formats 15.50 as Pounds with 2 digits as £15.50', () => {
    const value = 15.50;
    const options = new NumericOptions();
    options.digits = 2;
    options.iso = 'GBP';
    options.format = 'currency';
    expect(skyNumeric.formatNumber(value, options)).toBe('£15.50');
  });

  // Testing ability only after a certain value is specified
  // using the truncateAfter configuration property
  it('does not truncate 5000 to 5K when truncateAfter set to 10000', () => {
    const value = 5000;
    const options = new NumericOptions();
    options.digits = 0;
    options.truncateAfter = 10000;
    expect(skyNumeric.formatNumber(value, options)).toBe('5,000');
  });

  it('formats 10001 to 10K when truncateAfter set to 10000', () => {
    const value = 10001;
    const options = new NumericOptions();
    options.digits = 0;
    options.truncateAfter = 10000;
    expect(skyNumeric.formatNumber(value, options)).toBe('10K');
  });

  // Adjusting test to expect either format of a negative.  MS browsers use system's Region
  // setting for Currency formatting.  For Negative currency, the windows default is parentheses
  // around the number. All other browsers use a preceeding negative sign (-).
  it('formats -15.50 as US dollar with 2 digits as -$15.50', () => {
    const value = -15.50;
    const options = new NumericOptions();
    options.digits = 2;
    options.iso = 'USD';
    options.format = 'currency';
    expect('-$15.50 ($15.50)').toContain(skyNumeric
      .formatNumber(value, options));
  });

  it('formats -15.50 as accounting with 2 digits as ($15.50)', () => {
    const value = -15.50;
    const options = new NumericOptions();
    options.digits = 2;
    options.iso = 'USD';
    options.format = 'currency';
    options.currencySign = 'accounting';
    expect(skyNumeric .formatNumber(value, options)).toBe('($15.50)');
  });

  it('formats 145.45 with 1 digits as 145.5', () => {
    const value = 145.45;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('145.5');
  });

  it('formats 1.2345 with 3 digits as 1.235', () => {
    const value = 1.2345;
    const options = new NumericOptions();
    options.digits = 3;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.235');
  });

  it('should handle localized shorten symbols', () => {
    const originalValue = skyNumeric['symbolIndex'][3];
    const value = 1450;
    const options = new NumericOptions();

    skyNumeric['symbolIndex'][3].label = 'c';

    expect(skyNumeric.formatNumber(value, options)).toBe('1.5c');

    skyNumeric['symbolIndex'][3] = originalValue;
  });

  it('should allow truncate options to be optional', () => {
    const value = 1450;
    const options: NumericOptions = {
      digits: 1,
      format: 'currency',
      iso: 'USD'
    };

    expect(skyNumeric.formatNumber(value, options)).toBe('$1,450');
  });

  it('formats 1.00010 with 3 minDigits as 1.000', () => {
    const value = 1.00010;
    const options = new NumericOptions();
    options.minDigits = 3;
    options.digits = 3;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.000');
  });

  it('formats 1.00010 with 3 minDigits but 4 digits as 1.0001', () => {
    const value = 1.00010;
    const options = new NumericOptions();
    options.minDigits = 3;
    options.digits = 4;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.0001');
  });

  it('should handle both trailing 0s and commas', () => {
    const value = 1234.5;
    const options = new NumericOptions();
    options.digits = 2;
    options.format = 'currency';
    options.iso = 'USD';
    options.truncate = false;
    expect(skyNumeric.formatNumber(value, options)).toBe('$1,234.50');
  });

  it('should handle undefined format', () => {
    const value = 100;
    const options = new NumericOptions();
    options.format = undefined;

    expect(skyNumeric.formatNumber(value, options)).toBe('100');
  });

  describe('roundNumber', () => {

    beforeEach(() => {
      spyOn(SkyNumberFormatUtility, 'formatNumber').and.callFake((
        locale: string,
        value: number | string,
        style: SkyIntlNumberFormatStyle,
        digits?: string | null,
        currency: string | null = undefined,
        currencyAsSymbol: boolean = false) => {
        return value as (string | null);
      });
    });

    it('throws an error if precision is less than 0', function () {
      try {
        skyNumeric.formatNumber(1.003, { digits: -5, truncate: false, format: 'number', iso: undefined });
        fail('It should fail!');
      } catch (err) {
        expect(err.message).toEqual('SkyInvalidArgument: precision must be >= 0');
      }
    });

    it('rounds with a default precision of 0', () => {
      // Note: An 'undefined' value for digits would normally not work but is here to test the
      // rounding function and the spy for the actual formatting allows this to work
      expect(skyNumeric.formatNumber(123, {
        digits: undefined, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>123);
      expect(skyNumeric.formatNumber(0.75, {
        digits: undefined, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1);
      expect(skyNumeric.formatNumber(1.005, {
        digits: undefined, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1);
      expect(skyNumeric.formatNumber(1.3555, {
        digits: undefined, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1);
      expect(skyNumeric.formatNumber(1.77777, {
        digits: undefined, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>2);
      expect(skyNumeric.formatNumber(9.1, {
        digits: undefined, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>9);
      expect(skyNumeric.formatNumber(-1.5383, {
        digits: undefined, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>-2);
      expect(skyNumeric.formatNumber(1.5e3, {
        digits: undefined, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1500);
      expect(skyNumeric.formatNumber(-1.5e3, {
        digits: undefined, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>-1500);
    });

    it('rounds correctly when passed a custom precision', () => {
      expect(skyNumeric.formatNumber(123, {
        digits: 0, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>123);
      expect(skyNumeric.formatNumber(123.34, {
        digits: 0, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>123);
      expect(skyNumeric.formatNumber(0.75, {
        digits: 1, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>0.8);
      expect(skyNumeric.formatNumber(1.005, {
        digits: 1, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1.0);
      expect(skyNumeric.formatNumber(0.75, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>0.75);
      expect(skyNumeric.formatNumber(1.005, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1.01);
      expect(skyNumeric.formatNumber(1.3555, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1.36);
      expect(skyNumeric.formatNumber(1.001, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1.00);
      expect(skyNumeric.formatNumber(1.7777, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1.78);
      expect(skyNumeric.formatNumber(9.1, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>9.1);
      expect(skyNumeric.formatNumber(1234.5678, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1234.57);
      expect(skyNumeric.formatNumber(1.5383, {
        digits: 1, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1.5);
      expect(skyNumeric.formatNumber(1.5383, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1.54);
      expect(skyNumeric.formatNumber(1.5383, {
        digits: 3, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1.538);
      expect(skyNumeric.formatNumber(-1.5383, {
        digits: 1, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>-1.5);
      expect(skyNumeric.formatNumber(-1.5383, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>-1.54);
      expect(skyNumeric.formatNumber(-1.5383, {
        digits: 3, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>-1.538);
      expect(skyNumeric.formatNumber(-0.75, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>-0.75);
      expect(skyNumeric.formatNumber(-0.75, {
        digits: 3, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>-0.75);
      expect(skyNumeric.formatNumber(1.5e3, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>1500);
      expect(skyNumeric.formatNumber(-1.5e3, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any>-1500);
    });

    it('rounds really small numbers', () => {
      expect(skyNumeric.formatNumber(0.000000000000007, {
        digits: 4, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any> 0.0000);
      expect(skyNumeric.formatNumber(-0.000000000000007, {
        digits: 4, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any> 0.0000);
      expect(skyNumeric.formatNumber(7e-15, {
        digits: 4, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any> 0.0000);
      expect(skyNumeric.formatNumber(-7e-15, {
        digits: 4, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any> 0.0000);
    });

    it('rounds really big numbers', function () {
      expect(skyNumeric.formatNumber(700000000000000000000.324, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any> 700000000000000000000.32);
      expect(skyNumeric.formatNumber(700000000000000000000.324, {
        digits: 3, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any> 700000000000000000000.324);
      expect(skyNumeric.formatNumber(3518437208882.663, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any> 3518437208882.66);
      expect(skyNumeric.formatNumber(2.5368e15, {
        digits: 1, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any> 2536800000000000);
      expect(skyNumeric.formatNumber(2536800000000000.119, {
        digits: 2, truncate: false,
        format: 'number', iso: undefined
      })).toBe(<any> 2536800000000000.12);
    });

  });
});
