/**
 * Properties of a SKY UX tab.
 * @internal
 */
export interface SkyTabsetFixtureTab {
  /**
   * Whether the tab is selected.
   */
  active: boolean;

  /**
   * Whether the tab is disabled.
   */
  disabled: boolean;

  /**
   * The permalink value specified for the tab.
   */
  permalinkValue: string | undefined;

  /**
   * The count displayed in the tab header.
   */
  tabHeaderCount: string | undefined;

  /**
   * The text displayed in the tab header.
   */
  tabHeading: string | undefined;
}
