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
      return Promise.resolve({
        url,
        userHasAccess: true,
      });
    }

    if (url.startsWith('allow:')) {
      return Promise.resolve({
        url: url.replace('allow:', 'https:'),
        userHasAccess: true,
      });
    }

    if (url.startsWith('deny:')) {
      return Promise.resolve({
        url,
        userHasAccess: false,
      });
    }

    if (url.startsWith('slow:')) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            url: url.replace('slow:', 'https:'),
            userHasAccess: true,
          });
        }, 3000);
      });
    }

    if (url.startsWith('1bb-nav:')) {
      return Promise.resolve({
        url: `https://docs.blackbaud.com/engineering-system-docs/learn/spa/spa-navigation/spa-to-spa-navigation`,
        userHasAccess: true,
      });
    }

    return Promise.resolve({
      url,
      userHasAccess: false,
    });
  }
}
