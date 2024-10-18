import { SkyIntlNumberFormatStyle } from '@skyux/i18n';

import { SkyNumberFormatUtility } from './number-format-utility';

function formatCurrency(
  value: any,
  digits: string,
  currencySign?: 'accounting' | 'standard',
): string | null {
  return SkyNumberFormatUtility.formatNumber(
    'en-US',
    value,
    SkyIntlNumberFormatStyle.Currency,
    digits,
    'USD',
    'symbol',
    currencySign || 'standard',
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
    expect(() => formatCurrency({}, '')).toThrowError(
      "SkyInvalidPipeArgument: '[object Object]'",
    );
  });

  it('should return null for null values', function () {
    const result = formatCurrency(null, '');

    expect(result).toBeNull();
  });

  it('should throw error if digits invalid', function () {
    const digits = 'abcd-foobar';

    expect(() => formatCurrency(50, digits)).toThrowError(
      `${digits} is not a valid digit info for number pipes`,
    );
  });

  it('should throw error if digits out of range', function () {
    const digits = '0.9-0';

    expect(() => formatCurrency(50, digits)).toThrowError(
      'minimumIntegerDigits value is out of range.',
    );
  });
});
