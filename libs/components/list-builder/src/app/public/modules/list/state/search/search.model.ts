export class ListSearchModel {
  public searchText: string = '';
  public functions: Array<(data: any, searchText: string) => boolean> = [];
  public fieldSelectors: Array<string> = [];

  constructor(data?: any) {
    if (data) {
      this.searchText = data.searchText;
      this.functions = [...data.functions];
      this.fieldSelectors = data.fieldSelectors;
    }
  }
}
