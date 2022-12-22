import { SkyHref, SkyHrefResolver } from '@skyux/router';

/**
 * For testing, mock the resolver service.
 */
export class MockResolverService implements SkyHrefResolver {
  constructor(private userHasAccess: boolean) {}

  public resolveHref(param: { url: string }): Promise<SkyHref> {
    return Promise.resolve({
      url: param.url,
      userHasAccess: this.userHasAccess,
    });
  }
}
