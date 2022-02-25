import { SkyLookupShowMoreCustomPickerContext } from './lookup-show-more-custom-picker-context';

/**
 * Defines a custom picker to display when users select the button to view all options.
 */
export interface SkyLookupShowMoreCustomPicker {
  open: (pickerContext: SkyLookupShowMoreCustomPickerContext) => void;
}
