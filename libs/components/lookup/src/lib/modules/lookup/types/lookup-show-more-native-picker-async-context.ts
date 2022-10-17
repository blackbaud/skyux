import { SkyAutocompleteSearchAsyncFunction } from '../../autocomplete/types/autocomplete-search-async-function';

import { SkyLookupSelectModeType } from './lookup-select-mode-type';
import { SkyLookupShowMoreNativePickerConfig } from './lookup-show-more-native-picker-config';

/**
 * @internal
 * Context for the show more native picker. These values are provided by the lookup component.
 */
export class SkyLookupShowMoreNativePickerAsyncContext {
  public descriptorProperty: string;

  public idProperty: string;

  public initialSearch: string;

  public initialValue: any[];

  public searchAsync: SkyAutocompleteSearchAsyncFunction;

  public selectMode: SkyLookupSelectModeType;

  public showAddButton: boolean;

  public userConfig: SkyLookupShowMoreNativePickerConfig;

  constructor(
    descriptorProperty: string,
    idProperty: string,
    initialSearch: string,
    initialValue: any[],
    searchAsync: SkyAutocompleteSearchAsyncFunction,
    selectMode: SkyLookupSelectModeType,
    showAddButton: boolean,
    userConfig: SkyLookupShowMoreNativePickerConfig
  ) {
    this.descriptorProperty = descriptorProperty;
    this.idProperty = idProperty;
    this.initialSearch = initialSearch;
    this.initialValue = initialValue;
    this.searchAsync = searchAsync;
    this.selectMode = selectMode;
    this.showAddButton = showAddButton;
    this.userConfig = userConfig;
  }
}
