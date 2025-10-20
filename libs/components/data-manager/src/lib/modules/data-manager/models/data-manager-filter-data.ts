// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SkyDataManagerFilterData<TFilterState = any> {
  /**
   * Whether any filters are applied.
   */
  filtersApplied?: boolean;
  /**
   * The filter data used in the data manager. You may use any filter model that works for
   * your data set and models. See the demo for an example.
   */
  filters?: TFilterState;
}
