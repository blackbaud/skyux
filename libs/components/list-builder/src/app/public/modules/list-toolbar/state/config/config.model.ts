export class ListToolbarConfigModel {
  public searchEnabled: boolean = true;
  public sortSelectorEnabled: boolean = true;

  constructor(data?: any) {
    if (data) {
      this.searchEnabled = data.searchEnabled;
      this.sortSelectorEnabled = data.sortSelectorEnabled;
    }
  }
}
