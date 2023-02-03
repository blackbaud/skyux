/**
 * Extends the `any` type and supports values for data objects that you can inject into
 * the select field component to populate the picker.
 * @deprecated `SkySelectFieldComponent` is deprecated. Use `SkyLookupComponent` instead.
 */
export interface SkySelectField {
  /**
   * The category for an item.
   */
  category?: string;

  /**
   * The description to display below an item's label when `selectMode`
   * is set to `multiple`.
   */
  description?: string;

  /**
   * The ID for an item.
   */
  id?: string;

  /**
   * The label for an item.
   */
  label?: string;

  /**
   * All other properties for an item.
   */
  [index: string]: any;
}
