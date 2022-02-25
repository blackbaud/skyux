import { SkyAppSearchResultsProvider } from './search-results-provider';

class MockSearchResultsProvider extends SkyAppSearchResultsProvider {
  public getSearchResults(searchArgs: { searchText: string }): Promise<any> {
    return Promise.resolve({
      foo: 'bar',
    });
  }
}

describe('Search results provider', () => {
  it('should expose a ready method', async () => {
    const provider = new MockSearchResultsProvider();
    const result = await provider.getSearchResults({
      searchText: 'foo',
    });
    expect(result).toEqual({
      foo: 'bar',
    });
  });
});
