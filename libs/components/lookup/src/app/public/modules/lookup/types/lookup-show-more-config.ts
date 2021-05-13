import {
  SkyLookupShowMoreCustomPicker
} from './lookup-show-more-custom-picker';

import {
  SkyLookupShowMoreNativePickerConfig
} from './lookup-show-more-native-picker-config';

/**
 * Configuration for the lookup show more functionality.
 */
export interface SkyLookupShowMoreConfig {
  /**
   * Specifies a configuration object to display a custom UI when users select the show more button.
   */
  customPicker?: SkyLookupShowMoreCustomPicker;

  /**
   * Specifies the configuration for the built in UI when users select the show more button.
   */
  nativePickerConfig?: SkyLookupShowMoreNativePickerConfig;
}
