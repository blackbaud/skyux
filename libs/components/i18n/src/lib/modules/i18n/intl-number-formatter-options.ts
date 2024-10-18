export interface SkyIntlNumberFormatterOptions {
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  currency?: string | null;
  currencySign?: 'standard' | 'accounting';
  currencyDisplay?: 'code' | 'symbol' | 'narrowSymbol' | 'name';
}
