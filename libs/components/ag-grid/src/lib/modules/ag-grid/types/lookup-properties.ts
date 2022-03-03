import { TemplateRef } from '@angular/core';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyAutocompleteSearchFunction,
  SkyAutocompleteSearchFunctionFilter,
  SkyLookupAddClickEventArgs,
  SkyLookupSelectModeType,
  SkyLookupShowMoreConfig,
} from '@skyux/lookup';

export interface SkyLookupProperties {
  addClick?: (args: SkyLookupAddClickEventArgs) => void;
  ariaLabel?: string;
  autocompleteAttribute?: string;
  data: any[];
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
  searchResultTemplate?: TemplateRef<any>;
  searchTextMinimumCharacters?: number;
  selectMode?: SkyLookupSelectModeType;
  showAddButton?: boolean;
  showMoreConfig?: SkyLookupShowMoreConfig;
  wrapperClass?: string;
}

export function applySkyLookupPropertiesDefaults(
  skyLookupProperties: SkyLookupProperties
) {
  return {
    addClick: skyLookupProperties.addClick || undefined,
    ariaLabel: skyLookupProperties.ariaLabel || '',
    autocompleteAttribute: skyLookupProperties.autocompleteAttribute || 'off',
    data: skyLookupProperties.data || [],
    debounceTime: skyLookupProperties.debounceTime || 0,
    descriptorProperty: skyLookupProperties.descriptorProperty || 'name',
    disabled: skyLookupProperties.disabled || false,
    enableShowMore: skyLookupProperties.enableShowMore || false,
    idProperty: skyLookupProperties.idProperty || undefined,
    placeholderText: skyLookupProperties.placeholderText || '',
    propertiesToSearch: skyLookupProperties.propertiesToSearch || undefined,
    search: skyLookupProperties.search || undefined,
    searchAsync: skyLookupProperties.searchAsync || undefined,
    searchFilters: skyLookupProperties.searchFilters || [],
    searchResultsLimit: skyLookupProperties.searchResultsLimit || undefined,
    searchResultTemplate: skyLookupProperties.searchResultTemplate || undefined,
    searchTextMinimumCharacters:
      skyLookupProperties.searchTextMinimumCharacters || 1,
    selectMode: skyLookupProperties.selectMode || undefined,
    showAddButton: skyLookupProperties.showAddButton || false,
    showMoreConfig: skyLookupProperties.showMoreConfig || {},
    wrapperClass: 'ag-custom-component-popup',
  };
}
