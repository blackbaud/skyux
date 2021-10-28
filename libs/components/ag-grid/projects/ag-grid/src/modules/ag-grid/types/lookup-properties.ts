import { TemplateRef } from '@angular/core';
import {
  SkyAutocompleteSearchFunction,
  SkyAutocompleteSearchFunctionFilter,
  SkyLookupSelectModeType,
  SkyLookupShowMoreConfig
} from '@skyux/lookup';

export interface SkyLookupProperties {
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
  searchFilters?: SkyAutocompleteSearchFunctionFilter[];
  searchResultsLimit?: number;
  searchResultTemplate?: TemplateRef<any>;
  searchTextMinimumCharacters?: number;
  selectMode?: SkyLookupSelectModeType;
  showAddButton?: boolean;
  showMoreConfig?: SkyLookupShowMoreConfig;
  wrapperClass?: string;
}

export function applySkyLookupPropertiesDefaults(skyLookupProperties: SkyLookupProperties) {
  return {
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
    searchFilters: skyLookupProperties.searchFilters || [],
    searchResultsLimit: skyLookupProperties.searchResultsLimit || undefined,
    searchResultTemplate: skyLookupProperties.searchResultTemplate || undefined,
    searchTextMinimumCharacters: skyLookupProperties.searchTextMinimumCharacters || 1,
    selectMode: skyLookupProperties.selectMode || undefined,
    showAddButton: skyLookupProperties.showAddButton || false,
    showMoreConfig: skyLookupProperties.showMoreConfig || {},
    wrapperClass: 'ag-custom-component-popup'
  };
}
