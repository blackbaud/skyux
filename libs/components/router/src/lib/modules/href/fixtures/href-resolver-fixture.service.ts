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
    } else if (url.startsWith('slow://')) {
      return new Promise<SkyHref>((resolve) => {
        setTimeout(
          resolve.bind(null, {
            url: 'https://success' + path,
            userHasAccess: true,
          }),
          500,
        );
      });
    } else if (url.startsWith('1bb-nav://')) {
      return Promise.resolve<SkyHref>({
        url:
          'https://example.com' +
          path +
          (path.includes('?') ? '&' : '?') +
          'query=param',
        userHasAccess: true,
      });
    } else if (url.startsWith('nope://')) {
      return Promise.resolve<SkyHref>({
        url,
        userHasAccess: false,
      });
    } else if (url.startsWith('error://')) {
      throw new Error(`Error while resolving ${url}`);
    } else if (url.startsWith('reject://')) {
      return Promise.reject(`Unable to resolve ${url}`);
    } else {
      return Promise.resolve<SkyHref>({
        url,
        userHasAccess: true,
      });
    }
  }
}
