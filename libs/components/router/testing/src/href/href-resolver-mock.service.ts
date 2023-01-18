import { Inject, Injectable, InjectionToken } from '@angular/core';
import { SkyHref, SkyHrefResolver } from '@skyux/router';

export const MockUserHasAccess = new InjectionToken<boolean>(
  'MockUserHasAccess'
);

@Injectable()
export class SkyHrefResolverMockService implements SkyHrefResolver {
  constructor(@Inject(MockUserHasAccess) private userHasAccess: boolean) {}

  resolveHref(param: { url: string }): Promise<SkyHref> {
    return Promise.resolve({
      url: param.url,
      userHasAccess: this.userHasAccess,
    });
  }
}
