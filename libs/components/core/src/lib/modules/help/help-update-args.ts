/**
 *  Options for updating a globally accessible help dialog.
 */
export interface SkyHelpUpdateArgs {
  /**
   * A unique key that identifies the current help content to display. If set to `undefined`, the page's default help content will be displayed.
   */
  helpKey?: string;
  /**
   * A unique key that identifies the page's default help content to display. Set this property to `undefined` to unset the current page default help key.
   * */
  pageDefaultHelpKey?: string;
}
