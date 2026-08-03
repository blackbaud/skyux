import { Signal, TemplateRef } from '@angular/core';
import { SkyNumericOptions } from '@skyux/core';

import type { Observable } from 'rxjs';

import { SkyCellType } from './cell-type';
import { SkyAgGridLookupProperties } from './lookup-properties';
import { SkyAgGridValidatorProperties } from './validator-properties';

/**
 * The parameters that each SKY UX cell type accepts in the
 * [column definition's `cellRendererParams` property](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-styling-cellRendererParams).
 * Cell types that map to `never` do not accept renderer parameters.
 * Use `SkyAgGridColDef` to validate `cellRendererParams` against the column's
 * cell type.
 */
export interface SkyCellRendererParamsByType<
  TData = unknown,
  TValue = unknown,
> {
  [SkyCellType.Autocomplete]: never;
  [SkyCellType.Currency]: {
    /**
     * Options to pass to the `SkyNumericPipe` for formatting the cell value,
     * and validator properties to flag erroneous entries. `format` is always
     * set to `'currency'`. If not specified, `minDigits` defaults to `2` and
     * `truncate` defaults to `false`.
     */
    skyComponentProperties?: SkyNumericOptions &
      SkyAgGridValidatorProperties<TValue, TData>;
  };
  [SkyCellType.CurrencyValidator]: {
    /**
     * Options to pass to the `SkyNumericPipe` for formatting the cell value,
     * and validator properties to flag erroneous entries. `format` is always
     * set to `'currency'`. If not specified, `minDigits` defaults to `2` and
     * `truncate` defaults to `false`.
     */
    skyComponentProperties?: SkyNumericOptions &
      SkyAgGridValidatorProperties<TValue, TData>;
  };
  [SkyCellType.Date]: never;
  [SkyCellType.Lookup]: {
    /**
     * The parameters provided to the lookup component.
     */
    skyComponentProperties?: SkyAgGridLookupProperties;
  };
  [SkyCellType.Number]: {
    /**
     * The validator properties used to validate the cell value and display a
     * validation message.
     */
    skyComponentProperties?: SkyAgGridValidatorProperties<TValue, TData>;
  };
  [SkyCellType.NumberValidator]: {
    /**
     * The validator properties used to validate the cell value and display a
     * validation message.
     */
    skyComponentProperties?: SkyAgGridValidatorProperties<TValue, TData>;
  };
  [SkyCellType.RightAligned]: never;
  [SkyCellType.RowSelector]: {
    /**
     * The `aria-label` for the row selector checkbox, or a function that
     * returns it from the row's data. If not specified, the label defaults to
     * a localized string that includes the row number.
     */
    label?: string | ((data: TData) => string | Observable<string>);
  };
  [SkyCellType.Template]: {
    /**
     * The template to render in the cell. The template's context is a
     * `SkyCellRendererTemplateContext` with `value` and `row` properties.
     */
    template: TemplateRef<unknown> | Signal<TemplateRef<unknown> | undefined>;
  };
  [SkyCellType.Text]: {
    /**
     * The validator properties used to validate the cell value and display a
     * validation message.
     */
    skyComponentProperties?: SkyAgGridValidatorProperties<TValue, TData>;
  };
  [SkyCellType.Validator]: {
    /**
     * The validator properties used to validate the cell value and display a
     * validation message.
     */
    skyComponentProperties?: SkyAgGridValidatorProperties<TValue, TData>;
  };
}
