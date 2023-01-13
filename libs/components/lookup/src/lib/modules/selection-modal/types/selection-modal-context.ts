import { SkyAutocompleteSearchAsyncFunction } from '../../autocomplete/types/autocomplete-search-async-function';
import { SkyLookupSelectModeType } from '../../lookup/types/lookup-select-mode-type';
import { SkyLookupShowMoreNativePickerConfig } from '../../lookup/types/lookup-show-more-native-picker-config';

/**
 * @internal
 * Context for the selection modal. These values are provided by the selection modal service.
 */
export class SkySelectionModalContext {
  public descriptorProperty: string;

  public idProperty: string;

  public initialSearch: string;

  public initialValue: unknown[];

  public searchAsync: SkyAutocompleteSearchAsyncFunction;

  public selectMode: SkyLookupSelectModeType;

  public showAddButton: boolean;

  public userConfig: SkyLookupShowMoreNativePickerConfig;

  constructor(
    descriptorProperty: string,
    idProperty: string,
    initialSearch: string,
    initialValue: unknown[],
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
