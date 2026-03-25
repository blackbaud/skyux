import { SkyIllustrationResolverService } from './illustration-resolver.service';

class TestDefaultHrefResolverService extends SkyIllustrationResolverService {
  public resolveUrl(name: string): Promise<string> {
    return Promise.resolve(`https://example.com/${name}.svg`);
  }
}

describe('Illustration resolver service', () => {
  let resolverSvc: TestDefaultHrefResolverService;

  beforeEach(() => {
    resolverSvc = new TestDefaultHrefResolverService();
  });

  it('should return default value for resolveHref()', async () => {
    await expectAsync(resolverSvc.resolveHref('foo')).toBeResolvedTo('');
  });

  it('should return default value for getNames()', async () => {
    await expectAsync(resolverSvc.getNames()).toBeResolvedTo(
      jasmine.arrayWithExactContents([]),
    );
  });
});
