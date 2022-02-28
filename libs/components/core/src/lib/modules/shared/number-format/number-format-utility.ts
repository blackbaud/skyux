/* tslint:disable:no-null-keyword */

// This file is mostly ported from the Angular 4.x NumberPipe in order to maintain the old
// behavior of using the `Intl` API for formatting numbers rather than having to register every
// supported locale.
// https://github.com/angular/angular/blob/4.4.x/packages/common/src/pipes/number_pipe.ts

import { SkyIntlNumberFormatStyle, SkyIntlNumberFormatter } from '@skyux/i18n';

function isNumeric(value: any): boolean {
  return !isNaN(value - parseFloat(value));
}

function parseIntAutoRadix(text: string): number {
  const result: number = parseInt(text, 10);

  /* istanbul ignore next */
  if (isNaN(result)) {
    throw new Error('Invalid integer literal when parsing ' + text);
  }

  return result;
}

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
export class SkyNumberFormatUtility {
  private static _NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;

  /* istanbul ignore next */
  constructor() {}

  public static formatNumber(
    locale: string,
    value: number | string,
    style: SkyIntlNumberFormatStyle,
    digits?: string | null,
    currency: string | null = null,
    currencyAsSymbol: boolean = false,
    currencySign?: 'accounting' | 'standard'
  ): string | null {
    if (value == null) {
      return null;
    }

    // Convert strings to numbers
    value = typeof value === 'string' && isNumeric(value) ? +value : value;
    if (typeof value !== 'number') {
      throw Error(`SkyInvalidPipeArgument: '${value}'`);
    }

    let minInt: number | undefined = undefined;
    let minFraction: number | undefined = undefined;
    let maxFraction: number | undefined = undefined;
    if (style !== SkyIntlNumberFormatStyle.Currency) {
      // rely on Intl default for currency
      minInt = 1;
      minFraction = 0;
      maxFraction = 3;
    }

    if (digits) {
      const parts = digits.match(this._NUMBER_FORMAT_REGEXP);

      if (parts === null) {
        throw new Error(`${digits} is not a valid digit info for number pipes`);
      }

      /* istanbul ignore else */
      if (parts[1] != null) {
        // min integer digits
        minInt = parseIntAutoRadix(parts[1]);
      }

      /* istanbul ignore else */
      if (parts[3] != null) {
        // min fraction digits
        minFraction = parseIntAutoRadix(parts[3]);
      }

      /* istanbul ignore else */
      if (parts[5] != null) {
        // max fraction digits
        maxFraction = parseIntAutoRadix(parts[5]);
      }
    }

    return SkyIntlNumberFormatter.format(value as number, locale, style, {
      minimumIntegerDigits: minInt,
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
      currency: currency,
      currencyAsSymbol: currencyAsSymbol,
      currencySign: currencySign,
    });
  }
}
