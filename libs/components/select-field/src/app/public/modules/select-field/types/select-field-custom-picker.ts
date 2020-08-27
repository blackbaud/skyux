import {
  SkySelectField
} from './select-field';

import {
  SkySelectFieldPickerContext
} from '../select-field-picker-context';

export interface SkySelectFieldCustomPicker {

  /**
   * Specifies a function to call when users select the text field or button.
   * @param pickerContext A `SkySelectFieldPickerContext` object that provides values to the
   * custom picker.
   * @param updateValue A function that accepts an array of `SkySelectField` objects that
   * represent the values selected in the custom picker.
   */
  open: (
    pickerContext: SkySelectFieldPickerContext,
    updateValue: (value: SkySelectField[]) => void
  ) => void;

}
