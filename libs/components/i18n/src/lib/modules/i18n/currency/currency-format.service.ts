import { Injectable } from '@angular/core';

import { SkyI18nCurrencyFormat } from './currency-format';
import { SkyI18nCurrencySymbolLocation } from './currency-symbol-location';

const DEFAULT_LOCALE = 'en-US';
const DEFAULT_CURRENCY_CODE = 'USD';
const DEFAULT_GROUP_CHARACTER = ',';
const DEFAULT_DECIMAL_CHARACTER = '.';

interface CurrencyFormatParts {
  symbol: string;
  symbolLocation: SkyI18nCurrencySymbolLocation;
  decimalCharacter: string;
  groupCharacter: string;
}

/**
 * Used to format a currency within a given locale.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyI18nCurrencyFormatService {
  /**
   * Gets a currency's format.
   * @param isoCurrencyCode the ISO 4217 Currency Code. Defaults to 'USD'.
   * @param locale the locale. Defaults to 'en-US'. Examples: 'en-US', 'en-GB', 'fr-FR'.
   */
  public getCurrencyFormat(
    isoCurrencyCode: string = DEFAULT_CURRENCY_CODE,
    locale: string = DEFAULT_LOCALE,
  ): SkyI18nCurrencyFormat {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: isoCurrencyCode,
    });

    const resolvedOptions: Intl.ResolvedNumberFormatOptions =
      formatter.resolvedOptions();
    // We know this will be there as we give the currency options to the number format call above
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currencyCode = resolvedOptions.currency!;
    const parts = this.#formatToParts(formatter);

    /* istanbul ignore next */
    const precision = resolvedOptions.maximumFractionDigits ?? 0;

    return {
      decimalCharacter: parts.decimalCharacter,
      groupCharacter: parts.groupCharacter,
      isoCurrencyCode: currencyCode,
      locale,
      precision,
      symbol: parts.symbol,
      symbolLocation: parts.symbolLocation,
    };
  }

  #formatToParts(formatter: Intl.NumberFormat): CurrencyFormatParts {
    const BIG_VALUE_TO_GET_PART_INFO = 100_000_000;

    const parts = formatter.formatToParts(BIG_VALUE_TO_GET_PART_INFO);

    type IntlFindFn = (
      intlType: Intl.NumberFormatPartTypes,
      defaultValue: string,
    ) => string;
    const findOrDefault: IntlFindFn = (intlType, defaultValue) =>
      parts.find((p) => p.type === intlType)?.value ?? defaultValue;

    return {
      symbol: findOrDefault('currency', ''),
      symbolLocation:
        parts.findIndex((p) => p.type === 'currency') === 0
          ? 'prefix'
          : 'suffix',
      decimalCharacter: findOrDefault('decimal', DEFAULT_DECIMAL_CHARACTER),
      groupCharacter: findOrDefault('group', DEFAULT_GROUP_CHARACTER),
    };
  }
}
