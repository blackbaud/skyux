/**
 * @internal
 */
export class ListToolbarConfigModel {
  public searchEnabled = true;
  public sortSelectorEnabled = true;

  constructor(data?: any) {
    if (data) {
      this.searchEnabled = data.searchEnabled;
      this.sortSelectorEnabled = data.sortSelectorEnabled;
    }
  }
}
