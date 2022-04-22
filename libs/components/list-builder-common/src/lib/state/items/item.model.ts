/**
 * @deprecated
 */
export class ListItemModel {
  /**
   * Specifies the data for the item in the list.
   */
  public data: any;

  /**
   * Specifies the ID for the item in the list.
   * @required
   */
  public id: string;

  /**
   * Indicates whether the item in the list is selected.
   * @default false
   */
  public isSelected?: boolean;

  constructor(id: string, data?: any, isSelected?: boolean) {
    if (id === undefined) {
      throw new Error('All list item models require an ID');
    }

    this.id = id;

    if (data !== undefined) {
      this.data = data;
    }

    if (isSelected !== undefined) {
      this.isSelected = isSelected;
    }
  }
}
