export class ListSortLabelModel {
  public text: string;
  public fieldType: string;
  public fieldSelector: string;
  public global: boolean = false;
  public descending: boolean = false;

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
