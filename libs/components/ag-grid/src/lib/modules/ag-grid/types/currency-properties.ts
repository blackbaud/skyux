export interface SkyAgGridCurrencyProperties {
  currencySymbol?: string;
  decimalPlaces?: number | string;
  // Satisfies AutoNumeric.NegativeBracketsTypeOnBlurOption
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
