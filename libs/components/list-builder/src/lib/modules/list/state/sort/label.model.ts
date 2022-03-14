/**
 * These properties are a work in progress, and we do not recommend using them.
 */
export class ListSortLabelModel {
  /**
   * Specifies the text for the label.
   */
  public text: string;
  /**
   * Specifies the label type.
   */
  public fieldType: string;
  /**
   * Specifies the fields to sort.
   */
  public fieldSelector: string;
  /**
   * Indicates whether to sort all fields.
   * @default false
   */
  public global = false;
  /**
   * Indicates whether to sort in descending order.
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
