import { TemplateRef } from '@angular/core';

/**
 * Specifies configuration options to display the native picker when users select
 * the button to view all options.
 */
export interface SkyLookupShowMoreNativePickerConfig {
  /**
   * The template that formats each option in the picker. The lookup component
   * injects values into the template as `item` variables that reference all the object
   * properties of the options. If you do not specify a template, the picker uses
   * the same template as the dropdown list.
   */
  itemTemplate?: TemplateRef<unknown>;

  /**
   * The title for the picker.
   * @default "Select an option/Select options"
   */
  title?: string;
}
