import { SkyAutocompleteSearchFunction } from '../../autocomplete/types/autocomplete-search-function';

import { SkyLookupSelectModeType } from './lookup-select-mode-type';
import { SkyLookupShowMoreNativePickerConfig } from './lookup-show-more-native-picker-config';

/**
 * @internal
 * Context for the show more native picker. These values are provided by the lookup component.
 */
export interface SkyLookupShowMoreNativePickerContext {
  descriptorProperty: string;

  initialSearch: string;

  initialValue: any[];

  items: any[];

  search: SkyAutocompleteSearchFunction;

  selectMode: SkyLookupSelectModeType;

  showAddButton: boolean;

  userConfig: SkyLookupShowMoreNativePickerConfig;
}
