/**
 *  Options for updating global help.
 */
export interface SkyHelpUpdateArgs {
  /**
   * A unique key that identifies the current help content to display. If not provided, the page's default help content will be displayed.
   */
  helpKey?: string;
  /**
   * A unique key that identifies the page's default help content to display.
   * */
  pageDefaultHelpKey?: string;
}
