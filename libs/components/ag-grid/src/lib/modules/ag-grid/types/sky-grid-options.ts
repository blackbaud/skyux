import { GridOptions } from 'ag-grid-community';

export interface SkyAgGridGetGridOptionsArgs {
  /**
   * Specifies the [AG Grid `gridOptions`](https://www.ag-grid.com/javascript-grid-properties/) used to override default SKY UX gridOptions. SKY UX column types for components and column `cellClassRules` enforce required cell styling and cannot be overridden.
   */
  gridOptions: GridOptions;
  /**
   * Specifies the locale used for location-specific formatting, such as date values for the `SkyCellType.Date` column. This property accepts string values.
   */
  locale?: string;
}

/**
 * @deprecated Use SkyAgGridGetGridOptionsArgs instead.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SkyGetGridOptionsArgs extends SkyAgGridGetGridOptionsArgs {}
