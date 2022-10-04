import { SkyAutocompleteSearchAsyncFunction } from '../../autocomplete/types/autocomplete-search-async-function';

import { SkyLookupSelectModeType } from './lookup-select-mode-type';
import { SkyLookupShowMoreNativePickerConfig } from './lookup-show-more-native-picker-config';

/**
 * @internal
 * Context for the show more native picker. These values are provided by the lookup component.
 */
export interface SkyLookupShowMoreNativePickerAsyncContext {
  descriptorProperty: string;

  initialSearch: string;

  initialValue: any[];

  searchAsync: SkyAutocompleteSearchAsyncFunction;

  selectMode: SkyLookupSelectModeType;

  showAddButton: boolean;

  userConfig: SkyLookupShowMoreNativePickerConfig;

  idProperty: string;
}
