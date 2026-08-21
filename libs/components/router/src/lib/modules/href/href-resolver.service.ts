import { Injectable } from '@angular/core';

import { SkyHrefResolver } from './href-resolver';
import { SkyHref } from './types/href';
import { SkyHrefResolverArgs } from './types/href-resolver.args';

/**
 * The resolver used by the `skyHref` directive. This default implementation returns the link
 * as-is and grants access to every user. Provide your own implementation to control how links
 * are resolved.
 */
@Injectable()
export class SkyHrefResolverService implements SkyHrefResolver {
  /**
   * Resolves a link's final URL and whether the current user may access it.
   */
  public resolveHref(args: SkyHrefResolverArgs): Promise<SkyHref> {
    return Promise.resolve<SkyHref>({
      url: args.url,
      userHasAccess: true,
    });
  }
}
