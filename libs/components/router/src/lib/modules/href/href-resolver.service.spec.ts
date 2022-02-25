import { SkyHrefResolverService } from './href-resolver.service';

describe('HREF Resolver Service', () => {
  it('should resolve an https href', async () => {
    const fixtureService = new SkyHrefResolverService();

    const route = await fixtureService.resolveHref({
      url: 'https://example.com/page',
    });
    expect(route.userHasAccess).toBeTrue();
  });
});
