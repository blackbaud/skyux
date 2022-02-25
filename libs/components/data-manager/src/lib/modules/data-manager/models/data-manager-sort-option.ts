export interface SkyDataManagerSortOption {
  /**
   * Indicates whether to apply the sort in descending order.
   * @required
   */
  descending: boolean;
  /**
   * An ID for the sort option.
   * @required
   */
  id: string;
  /**
   * The label to display in the sort dropdown.
   * @required
   */
  label: string;
  /**
   * The data property to sort by.
   * @required
   */
  propertyName: string;
}
