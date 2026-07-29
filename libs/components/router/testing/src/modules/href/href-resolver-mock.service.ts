import { Injectable, InjectionToken, inject } from '@angular/core';
import { SkyHref, SkyHrefResolver } from '@skyux/router';

export const MockUserHasAccess = new InjectionToken<boolean>(
  'MockUserHasAccess',
);

/**
 * @internal
 */
@Injectable()
export class SkyHrefResolverMockService implements SkyHrefResolver {
  private readonly userHasAccess = inject(MockUserHasAccess);

  public resolveHref(param: { url: string }): Promise<SkyHref> {
    return Promise.resolve({
      url: param.url,
      userHasAccess: this.userHasAccess,
    });
  }
}
