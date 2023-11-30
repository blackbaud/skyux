import { TemplateRef } from '@angular/core';

import { SkyGridColumnAlignment } from './types/grid-column-alignment';

export type SkyGridColumnType =
  | 'autocomplete'
  | 'currency'
  | 'date'
  | 'lookup'
  | 'number'
  | 'selector'
  | 'template'
  | 'text';

export interface SkyGridColumnModel {
  /**
   * The horizontal alignment of the column's data and header.
   * Options include: `"left"`, `"center"`, and `"right"`.
   * @default "left"
   */
  alignment?: SkyGridColumnAlignment;

  /**
   * The description for the column.
   */
  description?: string;

  /**
   * Whether to disable the highlighting of search text in the column.
   * @default false
   */
  excludeFromHighlighting?: boolean;

  /**
   * The property to retrieve cell information from an entry on the grid `data` array.
   * You must provide either the `id` or `field` property for every column,
   * but do not provide both. If `id` does not exist on a column, then `field` is the entry
   * for the grid `selectedColumnIds` array.
   */
  field?: string;

  /**
   * Text to display in the column header.
   */
  heading?: string;

  /**
   * Whether the column is initially hidden when grid `selectedColumnIds` are not provided.
   * @default false
   */
  hidden?: boolean;

  /**
   * The unique ID for the column. You must provide either the `id` or `field` property
   * for every column, but do not provide both. If `field` does not exist on a column,
   * then the `id` property retrieves cell information from an entry on the grid `data` array.
   */
  id?: string;

  /**
   * The template to display inside an inline help popup for this column.
   */
  inlineHelpPopover?: TemplateRef<unknown> | any;

  /**
   * Whether the column sorts the grid when users click the column header.
   * @default true
   */
  isSortable?: boolean;

  /**
   * Whether the column is locked. The intent is to display locked columns first
   * on the left side of the grid. If set to `true`, then users cannot drag the column
   * to another position and or drag other columns before the locked column.
   * @default false
   */
  locked?: boolean;

  /**
   * The search function to apply for the specific column. By default,
   * the column executes a string compare on the column data.
   * @default (value, searchText) => value.toString().toLowerCase().indexOf(searchText) !== -1
   */
  search?: (value: any, searchText: string) => boolean;

  type: SkyGridColumnType;

  /**
   * The template for a column. This can be assigned as a reference
   * to the `template` attribute, or it can be assigned as a child of the `template` element
   * inside the `sky-grid-column` component. The template has access to the `value` variable,
   * which contains the value passed to the column, and the `row` variable, which contains
   * the entire row data.
   */
  template?: TemplateRef<unknown>;

  /**
   * The width of the column in pixels.
   * If undefined, the column width is evenly distributed.
   */
  width?: number;
}
