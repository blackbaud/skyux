export interface SkyDataManagerFilterData {
  /**
   * Indicates if any filters are currently applied.
   */
  filtersApplied?: boolean;
  /**
   * The filter data used within this data manager. You may use any filter model that works best for
   * your data set and models. See the demo for an example.
   */
  filters?: any;
}
