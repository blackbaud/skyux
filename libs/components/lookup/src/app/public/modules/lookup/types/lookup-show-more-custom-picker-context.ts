/**
 * Provides information for the launching of a custom "Show more" picker.
 */
export class SkyLookupShowMoreCustomPickerContext {
  /**
   * The items available for selection.
   */
  public items: any[];
  /**
   * The current search text from the lookup component.
   */
  public initialSearch: string;
  /**
   * The current selection from the lookup component.
   */
  public initialValue: any;
}
