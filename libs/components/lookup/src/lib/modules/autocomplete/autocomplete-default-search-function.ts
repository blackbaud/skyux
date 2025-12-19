import { normalizeDiacritics } from '../shared/sky-lookup-string-utils';

import { SkyAutocompleteDefaultSearchFunctionOptions } from './types/autocomplete-default-search-function-options';
import { SkyAutocompleteSearchArgs } from './types/autocomplete-search-args';
import { SkyAutocompleteSearchFunction } from './types/autocomplete-search-function';
import { SkyAutocompleteSearchFunctionFilter } from './types/autocomplete-search-function-filter';
import { SkyAutocompleteSearchFunctionResponse } from './types/autocomplete-search-function-response';

export function skyAutocompleteDefaultSearchFunction(
  options: SkyAutocompleteDefaultSearchFunctionOptions,
): SkyAutocompleteSearchFunction {
  const filterData = function (
    searchText: string,
    data: any[],
    args?: SkyAutocompleteSearchArgs,
  ): any[] {
    return data.filter((item: any) => {
      if (!options.searchFilters || !options.searchFilters.length) {
        return true;
      }

      // Find the first failing filter (we can skip the others if one fails).
      const failedFilter = options.searchFilters.find(
        (filter: SkyAutocompleteSearchFunctionFilter) => {
          return !filter.call({}, searchText, item, args);
        },
      );

      return failedFilter === undefined;
    });
  };

  const search = function (
    searchText: string,
    data: any[],
    args?: SkyAutocompleteSearchArgs,
  ): SkyAutocompleteSearchFunctionResponse {
    const results: any[] = [];

    const searchTextNormalized = normalizeDiacritics(searchText).toUpperCase();

    const filteredData = filterData(searchText, data, args);

    /* Autocomplete can now send empty text, return all filtered data in that scenario */
    if (searchText === '') {
      return filteredData;
    }

    for (let i = 0, n = filteredData.length; i < n; i++) {
      const result = filteredData[i];
      const isMatch = options.propertiesToSearch.find((property: string) => {
        let value = (result[property] || '').toString();
        value = normalizeDiacritics(value).toUpperCase();
        return value.indexOf(searchTextNormalized) > -1;
      });

      if (isMatch) {
        results.push(result);
      }
    }

    return results;
  };

  return search;
}
