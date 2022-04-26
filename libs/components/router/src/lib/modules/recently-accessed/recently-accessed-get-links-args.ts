/**
 * Parameters for retrieving a list of recently accessed links.
 */
export interface SkyRecentlyAccessedGetLinksArgs {
  /**
   * The links to retrieve.
   */
  requestedRoutes: {
    /**
     * The link's app.
     */
    app: string;

    /**
     * The link's route.
     */
    route: string;
  }[];
}
