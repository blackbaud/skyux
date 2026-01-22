/**
 * Used for applying sort to a `SkyDataGridComponent` as well as receiving updates when the data grid sorting changes.
 */
export interface SkyDataGridSort {
  /**
   * Whether to apply the sort in descending order.
   * @required
   */
  descending: boolean;
  /**
   * The data property to sort by.
   * @required
   */
  field: string;
}
