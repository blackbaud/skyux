export class ListItemModel {
  public id: string;
  public data: any;
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
