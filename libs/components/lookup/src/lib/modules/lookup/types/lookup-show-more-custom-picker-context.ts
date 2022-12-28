/**
 * Configuration options to launch a custom picker when users select
 * the button to view all options.
 */
export class SkyLookupShowMoreCustomPickerContext {
  /**
   * The options that users can select in the custom picker.
   */
  public items!: any[];
  /**
   * Search text to filter the contents of the custom picker.
   */
  public initialSearch!: string;
  /**
   * The current selections in the lookup field.
   */
  public initialValue!: any;
}
