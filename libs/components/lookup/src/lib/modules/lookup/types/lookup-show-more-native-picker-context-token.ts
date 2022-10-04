import { InjectionToken } from '@angular/core';

import { SkyLookupShowMoreNativePickerAsyncContext } from './lookup-show-more-native-picker-async-context';
import { SkyLookupShowMoreNativePickerContext } from './lookup-show-more-native-picker-context';

/**
 * @internal
 */
export const SKY_SHOW_MORE_NATIVE_PICKER_CONTEXT = new InjectionToken<
  | SkyLookupShowMoreNativePickerContext
  | SkyLookupShowMoreNativePickerAsyncContext
>('SkyShowMoreNativePickerContext');
