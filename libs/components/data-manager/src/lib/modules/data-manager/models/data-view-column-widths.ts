export interface SkyDataViewColumnWidths {
  /**
   * A map of columnIds to column widths at the xs breakpoint size.
   */
  xs: {
    [colId: string]: number;
  };
  /**
   * A map of columnIds to column widths at the sm or larger breakpoint size.
   */
  sm: {
    [colId: string]: number;
  };
}
