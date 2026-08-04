import {
  SkyAgGridAutocompleteProperties,
  SkyAutocompleteProperties,
} from './autocomplete-properties';
import { SkyCellType } from './cell-type';
import { SkyAgGridCurrencyProperties } from './currency-properties';
import {
  SkyAgGridDatepickerProperties,
  SkyDatepickerProperties,
} from './datepicker-properties';
import { SkyAgGridLookupProperties } from './lookup-properties';
import { SkyAgGridNumberProperties } from './number-properties';
import { SkyAgGridTextProperties } from './text-properties';

/**
 * The parameters that each SKY UX cell type accepts in the
 * [column definition's `cellEditorParams` property](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-editing-cellEditorParams).
 * Cell types that map to `never` do not accept editor parameters.
 * Use `defineSkyAgGridColDef()` to validate `cellEditorParams` against the column's
 * cell type.
 */
export interface SkyCellEditorParamsByType {
  [SkyCellType.Autocomplete]: {
    /**
     * The parameters provided to the autocomplete component.
     */
    skyComponentProperties?:
      | SkyAutocompleteProperties
      | SkyAgGridAutocompleteProperties;
  };
  [SkyCellType.Currency]: {
    /**
     * The parameters provided to the currency cell editor.
     */
    skyComponentProperties?: SkyAgGridCurrencyProperties;
  };
  [SkyCellType.CurrencyValidator]: {
    /**
     * The parameters provided to the currency cell editor.
     */
    skyComponentProperties?: SkyAgGridCurrencyProperties;
  };
  [SkyCellType.Date]: {
    /**
     * The parameters provided to the datepicker component.
     */
    skyComponentProperties?:
      | SkyDatepickerProperties
      | SkyAgGridDatepickerProperties;
  };
  [SkyCellType.Lookup]: {
    /**
     * The parameters provided to the lookup component.
     */
    skyComponentProperties?: SkyAgGridLookupProperties;
  };
  [SkyCellType.Number]: {
    /**
     * The parameters provided to the number cell editor.
     */
    skyComponentProperties?: SkyAgGridNumberProperties;
  };
  [SkyCellType.NumberValidator]: {
    /**
     * The parameters provided to the number cell editor.
     */
    skyComponentProperties?: SkyAgGridNumberProperties;
  };
  [SkyCellType.RightAligned]: never;
  [SkyCellType.RowSelector]: never;
  [SkyCellType.Template]: never;
  [SkyCellType.Text]: {
    /**
     * The parameters provided to the text cell editor.
     */
    skyComponentProperties?: SkyAgGridTextProperties;
  };
  [SkyCellType.Validator]: never;
}
