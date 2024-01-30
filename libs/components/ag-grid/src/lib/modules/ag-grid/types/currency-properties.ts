import AutoNumeric from 'autonumeric';

export interface SkyAgGridCurrencyProperties {
  currencySymbol?: string;
  decimalPlaces?: number | string;
  negativeBracketsTypeOnBlur?: AutoNumeric.NegativeBracketsTypeOnBlurOption | null;
}
