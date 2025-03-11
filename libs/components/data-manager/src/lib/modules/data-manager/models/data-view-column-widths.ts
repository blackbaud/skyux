export interface SkyDataViewColumnWidths {
  /**
   * A map of columnIds to column widths at the xs breakpoint size.
   */
  xs: Record<string, number>;
  /**
   * A map of columnIds to column widths at the sm or larger breakpoint size.
   */
  sm: Record<string, number>;
}
