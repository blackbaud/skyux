import { SkyIntlNumberFormatStyle, SkyIntlNumberFormatter } from '@skyux/i18n';

import { SkyChartValueFormat } from './value-format';

/**
 * Options for creating a chart value formatter.
 * @internal
 */
export interface SkyChartValueFormatterOptions {
  /**
   * How to format the value.
   */
  format: SkyChartValueFormat;

  /**
   * The ISO 4217 currency code used when `format` is `currency`. Defaults to
   * `USD`, matching `SkyI18nCurrencyFormatService`.
   */
  currencyCode: string | undefined;

  /**
   * The number of decimal places to display. When unset, the format's
   * locale-aware default is used.
   */
  digits: number | undefined;

  /**
   * The locale used to format the value.
   */
  locale: string;
}

/**
 * Creates a function that formats a numeric value according to the given
 * `format`, `currencyCode`, `digits`, and `locale`. Shared by every chart type
 * so value formatting is not tied to an axis.
 * @internal
 */
export function createSkyChartValueFormatter(
  options: SkyChartValueFormatterOptions,
): (value: number) => string {
  const { format, currencyCode = 'USD', digits, locale } = options;

  let style: SkyIntlNumberFormatStyle;

  switch (format) {
    case 'currency':
      style = SkyIntlNumberFormatStyle.Currency;
      break;

    case 'percent':
      style = SkyIntlNumberFormatStyle.Percent;
      break;

    default:
      style = SkyIntlNumberFormatStyle.Decimal;
      break;
  }

  return (value: number): string =>
    SkyIntlNumberFormatter.format(value, locale, style, {
      currency: format === 'currency' ? currencyCode : undefined,
      currencyDisplay: 'symbol',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
}
