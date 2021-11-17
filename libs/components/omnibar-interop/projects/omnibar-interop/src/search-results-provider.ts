export abstract class SkyAppSearchResultsProvider {
  public abstract getSearchResults(searchArgs: {
    searchText: string;
  }): Promise<any>;
}
