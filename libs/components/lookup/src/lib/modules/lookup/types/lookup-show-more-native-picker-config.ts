import { TemplateRef } from '@angular/core';

/**
 * Specifies configuration options to display the native picker when users select
 * the button to view all options.
 */
export interface SkyLookupShowMoreNativePickerConfig {
  /**
   * The template that formats each option in the picker. The lookup component
   * injects values into the template as `item` variables that reference all the object
   * properties of the options, and `checkboxId` when using multi-select, suitable for
   * using with `<label [for]="checkboxId">...` to toggle selection. If you do not
   * specify a template, the picker uses the same template as the dropdown list.
   */
  itemTemplate?: TemplateRef<unknown>;

  /**
   * The title for the picker.
   * @default "Select an option/Select options"
   * @deprecated Use the `selectionDescriptor` input to give context to the title and accessibility labels instead.
   */
  title?: string;

  /**
   * A descriptor for the item or items being selected. Use a plural term when the lookup's `selectMode` is set to `'multiple'`; otherwise, use a singular term. The descriptor helps set the picker's `aria-label` attributes for the multiselect toolbar controls, the search input, and the save button to provide text equivalents for screen readers [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility).
   * For example, when the descriptor is "constituents," the search input's `aria-label` is "Search constituents." For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   * @default "item"/"items"
   */
  selectionDescriptor?: string;
}
