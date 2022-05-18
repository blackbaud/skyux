/**
 * Resolved metsdata about a recently accessed link.
 */
export interface SkyRecentlyAccessedLink {
  /**
   * The label to display for the link.
   */
  label: string;
  /**
   * The date the link was last accessed.
   */
  lastAccessed: Date;
  /**
   * The link's fully-qualified URL.
   */
  url: string;
}
