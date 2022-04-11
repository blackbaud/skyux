import { SkyAgGridLookupProperties } from './types/lookup-properties';

/**
 * @internal
 */
export function applySkyLookupPropertiesDefaults(
  skyLookupProperties: SkyAgGridLookupProperties
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
