export class ListItemModel {
  public id: string;
  public data: any;

  constructor(id: string, data?: any) {
    if (id === undefined) {
      throw new Error('All list item models require an ID');
    }

    this.id = id;
    if (data !== undefined) {
      this.data = data;
    }
  }
}
