import {
  SkyAutocompleteSearchFunction
} from '../../autocomplete/types/autocomplete-search-function';

import {
  SkyLookupSelectMode
} from './lookup-select-mode';

import {
  SkyLookupShowMoreNativePickerConfig
} from './lookup-show-more-native-picker-config';

/**
 * @internal
 * Context for the show more native picker. These values are provided by the lookup component.
 */
 export class SkyLookupShowMoreNativePickerContext {
  public items: any[];
  public descriptorProperty: string;
  public initialSearch: string;
  public initialValue: any;
  public search: SkyAutocompleteSearchFunction;
  public selectMode: SkyLookupSelectMode;
  public showAddButton: boolean;
  public userConfig: SkyLookupShowMoreNativePickerConfig;
}
