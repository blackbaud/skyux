import { SkyLookupShowMoreCustomPicker } from './lookup-show-more-custom-picker';

import { SkyLookupShowMoreNativePickerConfig } from './lookup-show-more-native-picker-config';

/**
 * Specifies configuration options for the picker to display when users select the button
 * to view all options. You can use a native, out-of-the-box modal picker, or you can create
 * a custom picker. If you provide configuration options for both, the lookup component uses
 * the custom configuration.
 */
export interface SkyLookupShowMoreConfig {
  /**
   * Specifies a configuration object to display a custom picker.
   */
  customPicker?: SkyLookupShowMoreCustomPicker;

  /**
   * Specifies configuration options for the native picker.
   */
  nativePickerConfig?: SkyLookupShowMoreNativePickerConfig;
}
