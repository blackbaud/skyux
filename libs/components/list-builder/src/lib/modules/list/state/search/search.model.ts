/**
 * Specifies a function to dynamically manage the data source when users change the text
 * in the list field. The search function must return an array or a promise of an array.
 * The `search` property is particularly useful when the data source does not live
 * in the source code.
 * @deprecated
 */
export class ListSearchModel {
  /**
   * The text to search.
   * @default ""
   */
  public searchText = '';
  /**
   * The array of functions that returns a `boolean` value of `true` when
   * the search is successful. This property accepts a function of type
   * `(data: any, searchText: string) => boolean>.`
   */
  public functions: ((data: any, searchText: string) => boolean)[] = [];
  /**
   * The columns to search. The columns correspond to `field` values that
   * you specify with the list component's `data` property.
   */
  public fieldSelectors: string[] = [];

  constructor(data?: any) {
    if (data) {
      this.searchText = data.searchText;
      this.functions = [...data.functions];
      this.fieldSelectors = data.fieldSelectors;
    }
  }
}
