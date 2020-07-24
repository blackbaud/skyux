export interface SkyDataViewStateOptions {
  /**
   * The ID of this view.
   */
  viewId: string;
  /**
   * The IDs of the columns currently being displayed for column-based views.
   */
  displayedColumnIds?: string[];
  /**
   * An untyped property that can be used to keep track of any view-specific state information
   * relevant to a data manager that is not covered by the existing properties.
   */
  additionalData?: any;
}
