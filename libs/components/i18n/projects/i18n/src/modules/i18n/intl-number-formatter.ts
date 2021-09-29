import {
  SkyIntlNumberFormatterOptions
} from './intl-number-formatter-options';

import {
  SkyIntlNumberFormatStyle
} from './intl-number-format-style';

export abstract class SkyIntlNumberFormatter {

  public static format(
    num: number,
    locale: string,
    style: SkyIntlNumberFormatStyle,
    opts: SkyIntlNumberFormatterOptions = {}
  ): string {

    const {
      minimumIntegerDigits,
      minimumFractionDigits,
      maximumFractionDigits,
      currency,
      currencyAsSymbol = false,
      currencySign = 'standard'
    } = opts;

    const options: Intl.NumberFormatOptions & { currencySign: string } = {
      minimumIntegerDigits,
      minimumFractionDigits,
      maximumFractionDigits,
      style: SkyIntlNumberFormatStyle[style].toLowerCase(),
      currencySign
    };

    if (style === SkyIntlNumberFormatStyle.Currency) {
      options.currency = (typeof currency === 'string') ? currency : undefined;
      options.currencyDisplay = (currencyAsSymbol) ? 'symbol' : 'code';
    }

    return new Intl.NumberFormat(locale, options).format(num);
  }
}
