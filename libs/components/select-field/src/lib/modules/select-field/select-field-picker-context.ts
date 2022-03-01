import { Observable } from 'rxjs';

import { SkySelectField } from './types/select-field';
import { SkySelectFieldSelectMode } from './types/select-field-select-mode';

/**
 * Provides values to a custom picker.
 */
export class SkySelectFieldPickerContext {
  /**
   * An array of `SkySelectField` objects from the select field's `data` property.
   * Use this property to populate the custom picker with items for users to select.
   */
  public data: Observable<SkySelectField[]>;
  /**
   * Text from the select field's `pickerHeading` property. If your custom picker is a modal,
   * use this property to display a header.
   */
  public headingText?: string;

  /**
   * The boolean value from the select field's `inMemorySearchEnabled`. When `false`, it
   * circumvents the list-builder search function to enable consumers to provide results
   * from a remote source by updating the `data` value.
   */
  public inMemorySearchEnabled = true;

  /**
   * The select field's current value. If the select field's `selectMode` is set to `single`,
   * then this value is a `SkySelectField` object. If `selectMode` is set to `multiple`, then
   * this value is an array of `SkySelectField` objects. Use this property to select the
   * corresponding items in the custom picker.
   */
  public selectedValue?: any;
  /**
   * The `SkySelectFieldSelectMode` value from the select field's `selectMode` property.
   * Use this property to determine whether users can select one item or multiple items.
   */
  public selectMode?: SkySelectFieldSelectMode;
  /**
   * The boolean value from the select field's `showAddNewRecordButton` property.
   * Use this property to determine whether to display a button in the custom picker
   * for users to add items.
   * @default false
   */
  public showAddNewRecordButton = false;
}
