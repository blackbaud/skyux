/**
 * Extends the `any` type and supports values for data objects that you can inject into
 * the select field component to populate the picker.
 * @deprecated `SkySelectFieldComponent` is deprecated. Use `SkyLookupComponent` instead.
 */
export interface SkySelectField {
  /**
   * Specifies a category for an item.
   */
  category?: string;

  /**
   * Specifies a description to display below an item's label when `selectMode`
   * is set to `multiple`.
   */
  description?: string;

  /**
   * Specifies an ID for an item.
   */
  id?: string;

  /**
   * Specifies a label for an item.
   */
  label?: string;

  /**
   * Specifies all other properties for an item.
   */
  [index: string]: any;
}
