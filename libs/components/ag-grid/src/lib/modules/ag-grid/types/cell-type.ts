/**
 * These column types can be used by setting the AG Grid [column definition `type`](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-editing) to one of the following values.
 * <br/>
 * Any [SKY UX component](https://developer.blackbaud.com/skyux/components) can be made into a [cell editor](https://www.ag-grid.com/javascript-grid-cell-editor/) or [cell renderer](https://www.ag-grid.com/javascript-grid-cell-rendering-components/) component. If you would like to use a component that does not have a column definition yet, please consider [contributing it](https://developer.blackbaud.com/skyux/contribute/contribution-process) to the SKY UX data entry grid module, or [file an issue](https://developer.blackbaud.com/skyux/contribute/contribution-process/file-issue) in the [`@skyux/ag-grid` repo](https://github.com/blackbaud/skyux-ag-grid).
 */
export enum SkyCellType {
  /**
   * **Edit mode**
   * <br/>
   * Specifies that cells in the column will be edited as  [SKY UX autocomplete components](https://developer.blackbaud.com/skyux/components/autocomplete). You can set any of the autocomplete component's properties by passing `SkyCellEditorAutocompleteParams` in the [column definition's `cellEditorParams` property](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-editing). These params can be updated as other cell edits are made or [provided dynamically](https://www.ag-grid.com/javascript-grid-cell-editing/#dynamic-parameters) based on other cell values. See the demo for an example. Text can be entered and a value selected from the provided list.
   * <br/><br/>
   * **Read-only mode**
   * <br/>
   * Specifies that cells the column will display the currently selected value's name property by default. If the autocomplete needs to show a different property or needs to be formatted in any way, you can [define a `valueFormatter`](https://www.ag-grid.com/javascript-grid-value-formatters/) on the column definition.
   */
  Autocomplete = 'skyCellAutocomplete',
  /**
   * **Edit mode**
   * <br/>
   * Specifies that cells in the column will be edited as a currency amount.
   * <br/><br/>
   * **Read-only mode**
   * <br/>
   * Formats the display as currency using [SKY UX numeric components](https://developer.blackbaud.com/skyux/components/numeric).
   */
  Currency = 'skyCellCurrency',
  /**
   * **Edit and read-only modes**
   * <br/>
   * Combines SkyCellType.Currency and SkyCellType.Validator, where the value is displayed as a currency and passed to a validator function.
   */
  CurrencyValidator = 'skyCellCurrencyValidator',
  /**
   * **Edit mode**
   * <br/>
   * Specifies that cells in the column will be edited as [SKY UX datepicker components](https://developer.blackbaud.com/skyux/components/datepicker). You can set any of the datepicker component's properties by passing `SkyCellEditorDatepickerParams` in the [column definition's `cellEditorParams` property](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-editing). These params can be updated as other cell edits are made or [provided dynamically](https://www.ag-grid.com/javascript-grid-cell-editing/#dynamic-parameters) based on other cell values. See the demo for an example. Date values can be entered.
   * <br/><br/>
   * **Read-only mode**
   * <br/>
   * Specifies that cells in the column will display the currently selected date formatted as `MM-DD-YYYY`, or the date format of the locale passed to `getGridOptions()`. If you would like to overwrite this format, you can [define a `valueFormatter`](https://www.ag-grid.com/javascript-grid-value-formatters/) on the column definition. See the demo for an example.
   */
  Date = 'skyCellDate',
  /**
   * **Edit mode**
   * <br/>
   * Specifies that cells in the column will be edited as [SKY UX lookup components](https://developer.blackbaud.com/skyux-v5/components/lookup). You can set any of the lookup component's properties by passing `SkyCellEditorLookupParams` in the [column definition's `cellEditorParams` property](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-editing). These params can be updated as other cell edits are made or [provided dynamically](https://www.ag-grid.com/javascript-grid-cell-editing/#dynamic-parameters) based on other cell values. See the demo for an example. Text can be entered and a value selected from the provided list.
   * <br/><br/>
   * **Read-only mode**
   * <br/>
   * Specifies that cells the column will display, by default, either: the name(s) of the selected value(s) if there are less than 6, or a summary count of the values if there are more than 5. If the lookup needs to show a different property or needs to be formatted in any way, you can [define a `valueFormatter`](https://www.ag-grid.com/javascript-grid-value-formatters/) on the column definition.
   */
  Lookup = 'skyCellLookup',
  /**
   * **Edit mode**
   * <br/>
   * Specifies that cells in the column will be edited as HTML number `inputs`. Only numbers can be entered.
   * <br/><br/>
   * **Read-only mode**
   * <br/>
   * Specifies that cells in the column will render as the number value.
   */
  Number = 'skyCellNumber',
  /**
   * **Edit and read-only modes**
   * <br/>
   * Combines SkyCellType.Number and SkyCellType.Validator, where the value is displayed as a number and passed to a validator function.
   */
  NumberValidator = 'skyCellNumberValidator',
  /**
   * **Edit and read-only modes**
   * <br/>
   * Specifies that cells in the column will render as [SKY UX checkbox components](https://developer.blackbaud.com/skyux/components/checkbox). It allows the user to select multiple rows, and adds a highlight to selected rows. The [Ag Grid `rowNode`](https://www.ag-grid.com/javascript-grid-row-node/) will be updated to reflect the selected state.
   */
  RowSelector = 'skyCellRowSelector',
  /**
   * **Edit mode**
   * <br/>
   * Specifies that cells in the column will be edited as HTML text `inputs`. Any characters can be entered.
   * <br/><br/>
   * **Read-only mode**
   * <br/>
   * Specifies cells in the column will render as their string value.
   */
  Text = 'skyCellText',
  /**
   * **Edit and read-only modes**
   * <br/>
   * Specifies cell in the column will be passed to a validator function which flags erroneous entries. You can set the validator function and message by passing them to [column definition's `cellRendererParams` property](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-editing) as `skyComponentProperties.validator` and `skyComponentProperties.validatorMessage`. SkyCellType.Validator can be combined with other cell types, such as SkyCellType.Autocomplete or SkyCellType.Date, by using the array syntax for the [column definition's `type` property](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-editing).
   */
  Validator = 'skyCellValidator',
}
