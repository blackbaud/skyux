/**
 * @deprecated
 */
export class ListSortFieldSelectorModel {
  /**
   * Whether to sort in descending order.
   */
  public descending = false;

  /**
   * The fields to sort.
   */
  public fieldSelector: string;

  constructor(data?: any) {
    if (data) {
      this.fieldSelector = data.fieldSelector;
      this.descending = data.descending;
    }
  }
}
