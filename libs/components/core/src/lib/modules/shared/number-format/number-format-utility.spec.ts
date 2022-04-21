import { SkyIntlNumberFormatStyle } from '@skyux/i18n';

import { SkyNumberFormatUtility } from './number-format-utility';

function formatCurrency(
  value: any,
  digits: string,
  currencySign?: 'accounting' | 'standard'
): string {
  return SkyNumberFormatUtility.formatNumber(
    'en-US',
    value,
    SkyIntlNumberFormatStyle.Currency,
    digits,
    'USD',
    true,
    currencySign || 'standard'
  );
}

describe('Number format utility', function () {
  it('should format currency from number strings', function () {
    const result = formatCurrency('50.00', '');

    expect(result).toEqual('$50.00');
  });

  it('should format currency in accounting format', function () {
    const result = formatCurrency('-50.00', '', 'accounting');

    expect(result).toEqual('($50.00)');
  });

  it('should throw error for invalid types', function () {
    try {
      formatCurrency({}, '');
      fail('It should fail!');
    } catch (err) {
      expect(err.message).toEqual("SkyInvalidPipeArgument: '[object Object]'");
    }
  });

  it('should return null for null values', function () {
    const result = formatCurrency(null, '');

    expect(result).toBeNull();
  });

  it('should throw error if digits invalid', function () {
    const digits = 'abcd-foobar';

    try {
      formatCurrency(50, digits);
      fail('It should fail!');
    } catch (err) {
      expect(err.message).toEqual(
        `${digits} is not a valid digit info for number pipes`
      );
    }
  });

  it('should throw error if digits out of range', function (done) {
    const digits = '0.9-0';

    try {
      formatCurrency(50, digits);
      fail('It should fail!');
    } catch (err) {
      done();
    }
  });
});
