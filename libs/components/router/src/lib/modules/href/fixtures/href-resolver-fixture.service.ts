import { Injectable } from '@angular/core';

import { SkyHrefResolver } from '../href-resolver';
import { SkyHref } from '../types/href';

@Injectable()
export class HrefResolverFixtureService implements SkyHrefResolver {
  public resolveHref(param: { url: string }): Promise<SkyHref> {
    const url = param.url;
    const path = url.substring(url.indexOf('/', url.indexOf('://') + 3));
    if (url.startsWith('test://')) {
      return Promise.resolve<SkyHref>({
        url: 'https://success' + path,
        userHasAccess: true,
      });
    } else if (url.startsWith('1bb-nav://')) {
      return Promise.resolve<SkyHref>({
        url: 'https://example.com' + path + '?query=param',
        userHasAccess: true,
      });
    } else if (url.startsWith('nope://')) {
      return Promise.resolve<SkyHref>({
        url,
        userHasAccess: false,
      });
    } else if (url.startsWith('error://')) {
      throw new Error(`Error while resolving ${url}`);
    } else {
      return Promise.resolve<SkyHref>({
        url,
        userHasAccess: true,
      });
    }
  }
}
