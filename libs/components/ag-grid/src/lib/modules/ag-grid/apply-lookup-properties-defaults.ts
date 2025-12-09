import { SkyAgGridLookupProperties } from './types/lookup-properties';

/**
 * @internal
 */
export function applySkyLookupPropertiesDefaults(
  skyLookupProperties: SkyAgGridLookupProperties | undefined,
): SkyAgGridLookupProperties {
  /* istanbul ignore if */
  if (!skyLookupProperties) {
    return {};
  }

  return {
    addClick: skyLookupProperties.addClick,
    ariaLabel: skyLookupProperties.ariaLabel || '',
    autocompleteAttribute: skyLookupProperties.autocompleteAttribute || 'off',
    data: skyLookupProperties.data || [],
    debounceTime: skyLookupProperties.debounceTime || 0,
    descriptorProperty: skyLookupProperties.descriptorProperty || 'name',
    disabled: skyLookupProperties.disabled || false,
    enableShowMore: skyLookupProperties.enableShowMore || false,
    idProperty: skyLookupProperties.idProperty,
    placeholderText: skyLookupProperties.placeholderText || '',
    propertiesToSearch: skyLookupProperties.propertiesToSearch,
    search: skyLookupProperties.search,
    searchAsync: skyLookupProperties.searchAsync,
    searchFilters: skyLookupProperties.searchFilters || [],
    searchResultsLimit: skyLookupProperties.searchResultsLimit,
    searchResultTemplate: skyLookupProperties.searchResultTemplate,
    searchTextMinimumCharacters:
      skyLookupProperties.searchTextMinimumCharacters || 1, // TODO: what will be the impact with ag grid search
    selectMode: skyLookupProperties.selectMode,
    showAddButton: skyLookupProperties.showAddButton || false,
    showMoreConfig: skyLookupProperties.showMoreConfig || {},
    wrapperClass: 'ag-custom-component-popup',
  };
}
