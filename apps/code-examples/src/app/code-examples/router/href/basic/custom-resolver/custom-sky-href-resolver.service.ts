import { Injectable } from '@angular/core';
import { SkyHref, SkyHrefResolver } from '@skyux/router';

/**
 * Example of a custom resolver that returns a link as-is. Blackbaud uses a resolver to check
 * whether a user has access to a link before returning it, and rewrites the link from a custom
 * protocol to a standard protocol with a domain.
 */
@Injectable({
  providedIn: 'root',
})
export class CustomSkyHrefResolverService implements SkyHrefResolver {
  public resolveHref(param: { url: string }): Promise<SkyHref> {
    const url = param.url;
    if (url.startsWith('http:') || url.startsWith('https:')) {
      return Promise.resolve<SkyHref>({
        url: url,
        userHasAccess: true,
      });
    } else if (url.startsWith('allow:')) {
      return Promise.resolve<SkyHref>({
        url: url.replace('allow:', 'https:'),
        userHasAccess: true,
      });
    } else if (url.startsWith('deny:')) {
      return Promise.resolve<SkyHref>({
        url: url,
        userHasAccess: false,
      });
    } else if (url.startsWith('slow:')) {
      return new Promise<SkyHref>((resolve) => {
        setTimeout(() => {
          resolve({
            url: url.replace('slow:', 'https:'),
            userHasAccess: true,
          });
        }, 3000);
      });
    } else if (url.startsWith('1bb-nav:')) {
      return Promise.resolve<SkyHref>({
        url: `https://docs.blackbaud.com/engineering-system-docs/learn/spa/spa-navigation/spa-to-spa-navigation`,
        userHasAccess: true,
      });
    } else {
      return Promise.resolve({
        url: url,
        userHasAccess: false,
      });
    }
  }
}
