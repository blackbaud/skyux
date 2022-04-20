/**
 * @deprecated `SkyGridComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
export interface SkyGridColumnWidthModelChange {
  /**
   * Specifies the id of the column.
   */
  id?: string;

  /**
   * Specifies the field of the column.
   */
  field?: string;

  /**
   * Specifies the width of the column in pixels.
   */
  width: number;
}
