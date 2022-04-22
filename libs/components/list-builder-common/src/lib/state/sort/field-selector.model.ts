/**
 * @deprecated
 */
export class ListSortFieldSelectorModel {
  /**
   * Indicates whether to sort in descending order.
   */
  public descending = false;

  /**
   * Specifies the fields to sort.
   */
  public fieldSelector: string;

  constructor(data?: any) {
    if (data) {
      this.fieldSelector = data.fieldSelector;
      this.descending = data.descending;
    }
  }
}
