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
  /**
   * Specifies the maximum number of digits after the decimal separator.
   * @default 1
   */
  public digits?: number = 1;

  /**
   * Specifies how to format the number. Options are `currency` or `number`.
   * @default "number"
   */
  public format?: string = 'number';

  /**
   * Specifies the format of the currency.
   * @default "standard"
   */
  public currencySign?: 'accounting' | 'standard' = 'standard';

  /**
   * Specifies the ISO4217 currency code to use for currency formatting.
   * @default "USD"
   */
  public iso?: string = 'USD';

  /**
   * Specifies the locale code to use when formatting.
   */
  public locale?: string;

  /**
   * Specifies the minimum number of digits after the decimal separator. This property only applies
   * when the `truncate` property is set to `false`. If `digits` specifies a maximum number of
   * digits, then `minDigits` must be less than that value.
   */
  public minDigits?: number;

  /**
   * Indicates whether to shorten numbers to rounded numbers and abbreviation characters
   * such as K for thousands, M for millions, B for billions, and T for trillions.
   */
  public truncate?: boolean = true;

  /**
   * Specifies the minimum value at which numbers are shortened to rounded numbers and abbreviation characters. Values under `1000` are not truncated.
   * @default 1000
   */
  public truncateAfter?: number = 1000;
}
