import { SkyHref } from './types/href';

/**
 * A contract for resolving the links used by the `skyHref` directive.
 */
export interface SkyHrefResolver {
  /**
   * Resolves a link's final URL and whether the current user may access it.
   * @param param The link to resolve.
   */
  resolveHref(param: { url: string }): Promise<SkyHref>;
}
