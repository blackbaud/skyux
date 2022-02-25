export interface SkyDataViewStateOptions {
  /**
   * The ID of this view.
   */
  viewId: string;
  /**
   * The IDs of the columns able to be displayed for column-based views. This property is required when utilizing a grid-based view, a column picker, or both.
   */
  columnIds?: string[];
  /**
   * The IDs of the columns displayed for column-based views.
   */
  displayedColumnIds?: string[];
  /**
   * An untyped property that can track any view-specific state information
   * relevant to a data manager that existing properties do not cover.
   */
  additionalData?: any;
}
