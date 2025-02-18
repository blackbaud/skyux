import { TestBed } from '@angular/core/testing';

import { SkyIconSvgResolverService } from './icon-svg-resolver.service';

describe('Icon SVG resolver service with error', () => {
  it('should throw an error when the request fails', async () => {
    const fetchMock = spyOn(window, 'fetch').and.resolveTo(
      new Response('Internal Server Error', {
        status: 500,
      }),
    );
    // TestBed.resetTestEnvironment();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [SkyIconSvgResolverService],
    });

    const resolverSvc = TestBed.inject(SkyIconSvgResolverService);

    const hrefPromise = resolverSvc.resolveHref(
      'single-size',
      undefined,
      undefined,
    );

    await expectAsync(hrefPromise).toBeRejectedWithError(
      `Icon sprite could not be loaded.`,
    );

    // Fetch should only be called once per instance of the resolver service
    // and the result shared across subsequent calls to resolveHref().
    expect(fetchMock).toHaveBeenCalledOnceWith(
      'https://sky.blackbaudcdn.net/static/skyux-icons/7/assets/svg/skyux-icons.svg',
    );
  });
});
