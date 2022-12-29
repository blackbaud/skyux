/**
 * Specifies the information for the callback used when adding a new item to the lookup component.
 */
export interface SkyLookupAddCallbackArgs {
  /**
   * The new item which has been added to the data. This item will be automatically selected.
   */
  item: any;

  /**
   * The new state of the data source for the lookup component to search when users
   * enter text. If not specified, the component will use the current state of the lookup
   * component's `data` input; however, if this is not yet updated the new item will not be
   * automatically selected.
   */
  data?: any[];
}
