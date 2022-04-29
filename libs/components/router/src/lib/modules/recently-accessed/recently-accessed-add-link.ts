/**
 * A link to add to the recently accessed links.
 */
export interface SkyRecentlyAccessedAddLink {
  /**
   * The link's app.
   */
  app: string;
  /**
   * The link's route.
   */
  route: string;
  /**
   * The link's parameters.
   */
  params?: { [key: string]: string };
}
