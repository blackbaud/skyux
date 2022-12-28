/**
 * Extends the `any` type and supports values for data objects that you can inject into
 * the select field component to populate the picker.
 * @deprecated `SkySelectFieldComponent` is deprecated. Use `SkyLookupComponent` instead.
 */
export interface SkySelectField {
  /**
   * A category for an item.
   */
  category?: string;

  /**
   * A description to display below an item's label when `selectMode`
   * is set to `multiple`.
   */
  description?: string;

  /**
   * An ID for an item.
   */
  id?: string;

  /**
   * A label for an item.
   */
  label?: string;

  /**
   * All other properties for an item.
   */
  [index: string]: any;
}
