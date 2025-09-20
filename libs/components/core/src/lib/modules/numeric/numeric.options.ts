import { SkyAppFormat } from '../format/app-format';
import { SkyLogService } from '../log/log.service';

/**
 * Provides arguments for the number to format.
 */
export interface SkyNumericOptions {
  /**
   * Specifies the maximum number of digits after the decimal separator.
   */
  digits?: number;

  /**
   * Specifies how to format the number. Options are `currency` or `number`.
   */
  format?: string;

  /**
   * Specifies the format of the currency.
   */
  currencySign?: 'accounting' | 'standard';

  /**
   * Specifies the display of the currency. Defaults to 'symbol'.
   */
  currencyDisplay?: 'code' | 'symbol' | 'narrowSymbol' | 'name';

  /**
   * Specifies the ISO4217 currency code to use for currency formatting.
   */
  iso?: string;

  /**
   * Specifies the locale code to use when formatting.
   */
  locale?: string;

  /**
   * Specifies the minimum number of digits after the decimal separator. This property only applies
   * when the `truncate` property is set to `false`. If `digits` specifies a maximum number of
   * digits, then `minDigits` must be less than that value.
   */
  minDigits?: number;

  /**
   * Indicates whether to shorten numbers to rounded numbers and abbreviation characters
   * such as K for thousands, M for millions, B for billions, and T for trillions.
   */
  truncate?: boolean;

  /**
   * Specifies the minimum value at which numbers are shortened to rounded numbers and abbreviation characters. Values less than `1000` are not truncated.
   */
  truncateAfter?: number;
}

/**
 * Provides arguments for the number to format.
 * @deprecated Use the `SkyNumericOptions` interface instead.
 * @internal
 */
export class NumericOptions implements SkyNumericOptions {
  public digits?: number = 1;

  public format?: string = 'number';

  public currencySign?: 'accounting' | 'standard' = 'standard';

  public currencyDisplay?: 'code' | 'symbol' | 'narrowSymbol' | 'name';

  public iso?: string = 'USD';

  public locale?: string;

  public minDigits?: number;

  public truncate?: boolean = true;

  public truncateAfter?: number = 1000;

  constructor() {
    const logService = new SkyLogService(new SkyAppFormat());

    logService.deprecated('NumericOptions', {
      deprecationMajorVersion: 7,
      moreInfoUrl: 'https://developer.blackbaud.com/skyux/components/numeric',
      replacementRecommendation:
        'Use the `SkyNumericOptions` interface instead.',
    });
  }
}
