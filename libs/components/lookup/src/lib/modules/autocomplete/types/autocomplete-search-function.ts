import { SkyAutocompleteSearchArgs } from './autocomplete-search-args';
import { SkyAutocompleteSearchFunctionResponse } from './autocomplete-search-function-response';

export type SkyAutocompleteSearchFunction = (
  searchText: string,
  data: any[],
  args?: SkyAutocompleteSearchArgs
) => SkyAutocompleteSearchFunctionResponse;
