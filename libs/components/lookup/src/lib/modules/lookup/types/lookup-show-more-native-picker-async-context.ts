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
  public initialValue: unknown[];
  public searchAsync: SkyAutocompleteSearchAsyncFunction;
  public selectMode: SkyLookupSelectModeType;
  public showAddButton: boolean;
  public userConfig: SkyLookupShowMoreNativePickerConfig;
}
