import {
  SkyAutocompleteSearchFunction,
  SkyAutocompleteSearchFunctionFilter,
  SkyAutocompleteSearchFunctionResponse,
  SkyAutocompleteDefaultSearchFunctionOptions
} from './types';

export function skyAutocompleteDefaultSearchFunction(
  options: SkyAutocompleteDefaultSearchFunctionOptions
): SkyAutocompleteSearchFunction {

  const filterData = function (searchText: string, data: any[]): any[] {
    return data.filter((item: any) => {
      if (!options.searchFilters || !options.searchFilters.length) {
        return true;
      }

      // Find the first failing filter (we can skip the others if one fails).
      const failedFilter = options.searchFilters
        .find((filter: SkyAutocompleteSearchFunctionFilter) => {
          return !(filter.call({}, searchText, item));
        });

      return (failedFilter === undefined);
    });
  };

  const search = function (
    searchText: string,
    data: any[]
  ): SkyAutocompleteSearchFunctionResponse {

    const searchTextLower = searchText.toLowerCase();
    const filteredData = filterData(searchText, data);
    const results = [];

    for (let i = 0, n = filteredData.length; i < n; i++) {
      const limitReached = (
        options.searchResultsLimit &&
        options.searchResultsLimit <= results.length
      );

      if (limitReached) {
        return results;
      }

      const result = filteredData[i];
      const isMatch = options.propertiesToSearch.find((property: string) => {
        const value = (result[property] || '').toString().toLowerCase();
        return (value.indexOf(searchTextLower) > -1);
      });

      if (isMatch) {
        results.push(result);
      }
    }

    return results;
  };

  return search;
}
