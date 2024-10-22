import { SkyIntlNumberFormatStyle } from './intl-number-format-style';
import { SkyIntlNumberFormatterOptions } from './intl-number-formatter-options';

export abstract class SkyIntlNumberFormatter {
  public static format(
    num: number,
    locale: string,
    style: SkyIntlNumberFormatStyle,
    opts: SkyIntlNumberFormatterOptions = {},
  ): string {
    const {
      minimumIntegerDigits,
      minimumFractionDigits,
      maximumFractionDigits,
      currency,
      currencySign = 'standard',
      currencyDisplay = 'code',
    } = opts;

    const options: Intl.NumberFormatOptions & { currencySign: string } = {
      minimumIntegerDigits,
      minimumFractionDigits,
      maximumFractionDigits,
      style: SkyIntlNumberFormatStyle[style].toLowerCase() as
        | 'decimal'
        | 'percent'
        | 'currency',
      currencySign,
    };

    if (style === SkyIntlNumberFormatStyle.Currency) {
      options.currency = typeof currency === 'string' ? currency : undefined;
      options.currencyDisplay = currencyDisplay;
    }

    return new Intl.NumberFormat(locale, options).format(num);
  }
}
