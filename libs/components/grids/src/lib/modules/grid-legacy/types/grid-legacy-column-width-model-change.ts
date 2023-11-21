/**
 * @deprecated `SkyGridLegacyComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
export interface SkyGridLegacyColumnWidthModelChange {
  /**
   * The ID of the column.
   */
  id?: string;

  /**
   * The field of the column.
   */
  field?: string;

  /**
   * The width of the column in pixels.
   */
  width: number;
}
