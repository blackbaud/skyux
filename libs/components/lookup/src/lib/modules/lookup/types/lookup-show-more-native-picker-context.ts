import { SkyAutocompleteSearchFunction } from '../../autocomplete/types/autocomplete-search-function';

import { SkyLookupSelectModeType } from './lookup-select-mode-type';
import { SkyLookupShowMoreNativePickerConfig } from './lookup-show-more-native-picker-config';

/**
 * @internal
 * Context for the show more native picker. These values are provided by the lookup component.
 */
export class SkyLookupShowMoreNativePickerContext {
  public descriptorProperty: string;

  public initialSearch: string;

  public initialValue: any[];

  public items: any[];

  public search: SkyAutocompleteSearchFunction;

  public selectMode: SkyLookupSelectModeType;

  public showAddButton: boolean;

  public userConfig: SkyLookupShowMoreNativePickerConfig;

  constructor(
    descriptorProperty: string,
    initialSearch: string,
    initialValue: any[],
    items: any[],
    search: SkyAutocompleteSearchFunction,
    selectMode: SkyLookupSelectModeType,
    showAddButton: boolean,
    userConfig: SkyLookupShowMoreNativePickerConfig
  ) {
    this.descriptorProperty = descriptorProperty;
    this.initialSearch = initialSearch;
    this.initialValue = initialValue;
    this.items = items;
    this.search = search;
    this.selectMode = selectMode;
    this.showAddButton = showAddButton;
    this.userConfig = userConfig;
  }
}
