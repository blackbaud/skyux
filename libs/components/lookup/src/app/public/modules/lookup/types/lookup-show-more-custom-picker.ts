import {
  SkyLookupShowMoreCustomPickerContext
} from './lookup-show-more-custom-picker-context';

/**
 * Interface for defining a custom lookup show more picker.
 */
export interface SkyLookupShowMoreCustomPicker {

  open: (
    pickerContext: SkyLookupShowMoreCustomPickerContext
  ) => void;

}
