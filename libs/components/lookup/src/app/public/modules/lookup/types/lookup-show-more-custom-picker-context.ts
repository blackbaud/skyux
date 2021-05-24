/**
 * Specifies configuration options to launch a custom picker when users select
 * the button to view all options.
 */
export class SkyLookupShowMoreCustomPickerContext {
  /**
   * Specifies the options that users can select in the custom picker.
   */
  public items: any[];
  /**
   * Specifies search text to filter the contents of the custom picker.
   */
  public initialSearch: string;
  /**
   * Specifies the current selections in the lookup field.
   */
  public initialValue: any;
}
