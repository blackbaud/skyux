import { SkyHref, SkyHrefResolver } from '@skyux/router';

export class MockResolverService implements SkyHrefResolver {
  public userHasAccess = true;

  public resolveHref(param: { url: string }): Promise<SkyHref> {
    return Promise.resolve({
      url: param.url,
      userHasAccess: this.userHasAccess,
    });
  }
}
