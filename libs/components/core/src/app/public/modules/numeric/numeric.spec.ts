import {
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';

import {
  NumericOptions
} from './numeric.options';

import {
  SkyNumericService
} from './numeric.service';

const skyNumeric = new SkyNumericService(
  new CurrencyPipe('en-US'),
  new DecimalPipe('en-US')
);

describe('Numeric service', () => {
  it('formats 0 with 0 digits as 0', () => {
    const value = 0;
    const options = new NumericOptions();
    options.digits = 0;

    expect(skyNumeric.formatNumber(value, options)).toBe('0');
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

  it('formats 1000000 with 0 digits as 1M', () => {
    const value = 1000000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1M');
  });

  it('formats 1000000000 with 0 digits as 1B', () => {
    const value = 1000000000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1B');
  });

  it('formats 1000000000000 with 0 digits as 1T', () => {
    const value = 1000000000000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1T');
  });

  it('formats 999000000 as 999M', () => {
    const value = 999000000;
    const options = new NumericOptions();
    options.digits = 2;
    expect(skyNumeric.formatNumber(value, options)).toBe('999M');
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
});
