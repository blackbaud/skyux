/**
 * A resolved link for the `skyHref` directive.
 */
export interface SkyHref {
  /**
   * The name of the app that owns the route.
   */
  app?: string;
  /**
   * The app-relative path of the route. The path may contain `:`-prefixed parameter
   * placeholders, which a resolver substitutes with values from the requested link.
   */
  route?: string;
  /**
   * The link's resolved URL.
   */
  url: string;
  /**
   * Whether the current user may access the link.
   */
  userHasAccess?: boolean;
  aliases?: string[];
}
