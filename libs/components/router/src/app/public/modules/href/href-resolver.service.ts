import { Injectable } from '@angular/core';

import { SkyHrefResolver } from './href-resolver';
import { SkyHref } from './types/href';
import { SkyHrefResolverArgs } from './types/href-resolver.args';

/**
 * Return the link as-is.
 */
@Injectable()
export class SkyHrefResolverService implements SkyHrefResolver {
  public resolveHref(args: SkyHrefResolverArgs): Promise<SkyHref> {
    return Promise.resolve<SkyHref>({
      url: args.url,
      userHasAccess: true
    });
  }
}
