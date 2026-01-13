import { GridOptions } from 'ag-grid-community';

export interface SkyGetGridOptionsArgs<T = any> {
  /**
   * The [AG Grid `gridOptions`](https://www.ag-grid.com/angular-data-grid/grid-options/) that override default SKY UX `gridOptions`. SKY UX column types for components and column `cellClassRules` enforce required cell styling and cannot be overridden.
   */
  gridOptions: GridOptions<T>;
  /**
   * The locale for location-specific formatting, such as date values for the `SkyCellType.Date` column.
   */
  locale?: string;
  /**
   * The format to use for formatting date strings in the `SkyCellType.Date` column.
   * @default "shortDate"
   */
  dateFormat?: string;
}
