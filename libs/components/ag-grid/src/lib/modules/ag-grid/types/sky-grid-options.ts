import { GridOptions } from '@ag-grid-community/core';

export interface SkyGetGridOptionsArgs {
  /**
   * Specifies the [AG Grid `gridOptions`](https://www.ag-grid.com/javascript-grid-properties/) used to override default SKY UX gridOptions. SKY UX column types for components and column `cellClassRules` enforce required cell styling and cannot be overridden.
   */
  gridOptions: GridOptions;
  /**
   * Specifies the locale used for location-specific formatting, such as date values for the `SkyCellType.Date` column. This property accepts string values.
   */
  locale?: string;
}
