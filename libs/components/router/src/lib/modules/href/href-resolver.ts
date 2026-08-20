import { SkyHref } from './types/href';
import { SkyHrefResolverArgs } from './types/href-resolver.args';

/**
 * A contract for resolving the links used by the `skyHref` directive.
 */
export interface SkyHrefResolver {
  /**
   * Resolves a link's final URL and whether the current user may access it.
   */
  resolveHref(args: SkyHrefResolverArgs): Promise<SkyHref>;
}
