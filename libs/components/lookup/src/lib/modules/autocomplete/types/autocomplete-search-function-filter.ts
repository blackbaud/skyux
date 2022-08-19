import { SkyAutocompleteSearchArgs } from './autocomplete-search-args';

export type SkyAutocompleteSearchFunctionFilter = (
  searchText: string,
  item: any,
  args?: SkyAutocompleteSearchArgs
) => boolean;
