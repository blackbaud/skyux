export interface SkyAgGridCurrencyProperties {
  /**
   * The currency symbol to display in the cell.
   * @default "$"
   */
  currencySymbol?: string;
  /**
   * The number of decimal places to display on the currency.
   * @default 2
   */
  decimalPlaces?: number | string;
  /**
   * Adds the specified brackets around negative values when unfocused.
   */
  negativeBracketsTypeOnBlur?:
    | '(,)'
    | '[,]'
    | '<,>'
    | '{,}'
    | '〈,〉'
    | '｢,｣'
    | '⸤,⸥'
    | '⟦,⟧'
    | '‹,›'
    | '«,»'
    | null;
}
