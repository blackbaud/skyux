/**
 * The change event emitted when a link's availability changes.
 */
export interface SkyHrefChange {
  /**
   * Whether the current user may access the link.
   */
  userHasAccess: boolean;
}
