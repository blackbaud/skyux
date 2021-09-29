import {
  SkyI18nCurrencySymbolLocation
} from './currency-symbol-location';

/**
 * Used to describe a locale-specific currency format.
 */
export interface SkyI18nCurrencyFormat {
  /**
   * The ISO 4217 currency code.
   */
  isoCurrencyCode: string;

  /**
   * The fractional decimal character.
   */
  decimalCharacter: string;

  /**
   * The grouping character, e.g. '(1,000)'.
   */
  groupCharacter: string;

  /**
   * The locale.
   */
  locale: string;

  /**
   * The numeric precision (i.e., decimal places).
   */
  precision: number;

  /**
   * The currency symbol (e.g., '$').
   */
  symbol: string;

  /**
   * The symbol's location relative to the number.
   */
  symbolLocation: SkyI18nCurrencySymbolLocation;
}
