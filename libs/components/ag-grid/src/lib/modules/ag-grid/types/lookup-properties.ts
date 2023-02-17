import { TemplateRef } from '@angular/core';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyAutocompleteSearchFunction,
  SkyAutocompleteSearchFunctionFilter,
  SkyLookupAddClickEventArgs,
  SkyLookupSelectModeType,
  SkyLookupShowMoreConfig,
} from '@skyux/lookup';

export interface SkyAgGridLookupProperties {
  addClick?: (args: SkyLookupAddClickEventArgs) => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  autocompleteAttribute?: string;
  data?: unknown[];
  debounceTime?: number;
  descriptorProperty?: string;
  disabled?: boolean;
  enableShowMore?: boolean;
  idProperty?: string;
  placeholderText?: string;
  propertiesToSearch?: string[];
  search?: SkyAutocompleteSearchFunction;
  searchAsync?: (args: SkyAutocompleteSearchAsyncArgs) => void;
  searchFilters?: SkyAutocompleteSearchFunctionFilter[];
  searchResultsLimit?: number;
  searchResultTemplate?: TemplateRef<unknown>;
  searchTextMinimumCharacters?: number;
  selectMode?: SkyLookupSelectModeType;
  showAddButton?: boolean;
  showMoreConfig?: SkyLookupShowMoreConfig;
  wrapperClass?: string;
}
