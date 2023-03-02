import { GridOptions } from 'ag-grid-community';

export interface SkyGetGridOptionsArgs {
  /**
   * The [AG Grid `gridOptions`](https://www.ag-grid.com/javascript-grid-properties/) that override default SKY UX `gridOptions`. SKY UX column types for components and column `cellClassRules` enforce required cell styling and cannot be overridden.
   */
  gridOptions: GridOptions;
  /**
   * The locale for location-specific formatting, such as date values for the `SkyCellType.Date` column.
   */
  locale?: string;
}
