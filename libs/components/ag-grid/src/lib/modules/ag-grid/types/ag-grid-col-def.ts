/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ColDef,
  ICellEditorParams,
  ICellRendererParams,
} from 'ag-grid-community';

import { SkyCellEditorParamsByType } from './cell-editor-params-by-type';
import { SkyCellRendererParamsByType } from './cell-renderer-params-by-type';
import { SkyCellType } from './cell-type';

// Merges the params of all cell types in a union into a single type.
type UnionToIntersection<U> = (
  U extends unknown ? (u: U) => void : never
) extends (i: infer I) => void
  ? I
  : never;

/**
 * A column definition that validates `cellEditorParams` and
 * `cellRendererParams` against the SKY UX cell types in the column's `type`
 * property. Combine cell types by passing a union of `SkyCellType` values,
 * like `SkyAgGridColDef<SkyCellType.Number | SkyCellType.Validator>`.
 */
export type SkyAgGridColDef<
  T extends SkyCellType,
  TData = any,
  TValue = any,
> = Omit<
  ColDef<TData, TValue>,
  'type' | 'cellEditorParams' | 'cellRendererParams'
> & {
  type: T | T[];
  cellEditorParams?:
    | UnionToIntersection<SkyCellEditorParamsByType[T]>
    | ((
        params: ICellEditorParams<TData, TValue>,
      ) => UnionToIntersection<SkyCellEditorParamsByType[T]>);
  cellRendererParams?:
    | UnionToIntersection<SkyCellRendererParamsByType<TData, TValue>[T]>
    | ((
        params: ICellRendererParams<TData, TValue>,
      ) => UnionToIntersection<SkyCellRendererParamsByType<TData, TValue>[T]>);
};

/**
 * Builds a column definition whose `cellEditorParams` and `cellRendererParams`
 * are validated against the SKY UX cell types in the `type` property. The cell
 * type is inferred, so no type arguments are needed:
 * ```
 * skyAgGridColDef({
 *   field: 'endDate',
 *   type: [SkyCellType.Date, SkyCellType.Validator],
 *   cellRendererParams: { skyComponentProperties: { validator: ... } },
 * })
 * ```
 */
// `C` preserves the exact shape of the passed literal (like `satisfies`), `F`
// keeps `field` narrowed to its literal type for row-typed grid options, and
// the `Record` intersection rejects misspelled or unknown properties.
export function skyAgGridColDef<
  T extends SkyCellType,
  F extends string = never,
  C extends SkyAgGridColDef<T> = SkyAgGridColDef<T>,
>(
  colDef: C &
    SkyAgGridColDef<T> & { field?: F } & Record<
      Exclude<keyof C, keyof SkyAgGridColDef<T>>,
      never
    >,
): C & { field?: F } {
  return colDef;
}
