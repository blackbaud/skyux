import {
  TemplateRef
} from '@angular/core';

/**
 * Configuration for the native lookup show more picker.
 */
export interface SkyLookupShowMoreNativePickerConfig {
  /**
   * Specifies a template to format each search result in the picker's list.
   * The autocomplete component injects search result values into the template as item variables
   * that reference all of the object properties of the search results.
   */
  itemTemplate?: TemplateRef<any>;

  /**
   * Specifies the title of the picker.
   * @default 'Select an option/Select options'
   */
  title?: string;
}
