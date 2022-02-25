/**
 * Provides arguments for the number to format.
 */
export class NumericOptions {
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
   * Specifies the ISO4217 currency code to use for currency formatting. If you do not specify a
   * currency code, the component uses the browser's culture to determine the currency unless your
   * SPA provides a different culture with `SkyAppLocaleProvider`.
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
   * such as K for thousands, M for millions, B for billions, and T for trillion.
   */
  public truncate?: boolean = true;

  /**
   * Specifies the starting point after which numbers are shortened to rounded numbers
   * and abbreviation characters.
   * @default 0
   */
  public truncateAfter?: number = 0;
}
