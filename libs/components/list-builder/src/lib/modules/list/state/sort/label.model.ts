/**
 * These properties are a work in progress, and we do not recommend using them.
 * @deprecated
 */
export class ListSortLabelModel {
  /**
   * The text for the label.
   */
  public text: string;
  /**
   * The label type.
   */
  public fieldType: string;
  /**
   * The fields to sort.
   */
  public fieldSelector: string;
  /**
   * Whether to sort all fields.
   * @default false
   */
  public global = false;
  /**
   * Whether to sort in descending order.
   * @default false
   */
  public descending = false;

  constructor(data?: any) {
    if (data) {
      this.text = data.text;
      this.fieldType = data.fieldType;
      this.fieldSelector = data.fieldSelector;
      this.global = data.global;
      this.descending = data.descending;
    }
  }
}
