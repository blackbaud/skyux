import {
  SkySelectField
} from './select-field';

import {
  SkySelectFieldPickerContext
} from '../select-field-picker-context';

export interface SkySelectFieldCustomPicker {

  open: (
    pickerContext: SkySelectFieldPickerContext,
    updateValue: (value: SkySelectField[]) => void
  ) => void;

}
