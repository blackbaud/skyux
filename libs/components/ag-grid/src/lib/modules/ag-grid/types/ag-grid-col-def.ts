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
