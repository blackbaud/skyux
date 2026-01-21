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
  propertyName: string;
}
