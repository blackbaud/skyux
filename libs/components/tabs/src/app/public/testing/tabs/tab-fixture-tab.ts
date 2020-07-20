/**
 * Properties of a SKY UX tab.
 */
export interface SkyTabsetFixtureTab {

  /**
   * Indicates whether the tab is the currently selected tab.
   */
  active: boolean;

  /**
   * Indicates whether the tab is disabled.
   */
  disabled: boolean;

  /**
   * The permalink value specified for the tab.
   */
  permalinkValue: string;

  /**
   * The count displayed in the tab header.
   */
  tabHeaderCount: string;

  /**
   * The text displayed in the tab header.
   */
  tabHeading: string;

}
