import { TestBed } from '@angular/core/testing';

import { SkyIconSvgResolverService } from './icon-svg-resolver.service';
import { SkyIconVariantType } from './types/icon-variant-type';

describe('Icon SVG resolver service', () => {
  let fetchMock: jasmine.Spy<typeof fetch>;
  let resolverSvc: SkyIconSvgResolverService;

  function buildSymbolHtml(
    name: string,
    size: number,
    variant: SkyIconVariantType,
  ): string {
    return `<symbol viewBox="0 0 ${size} ${size}" id="sky-i-${name}-${size}-${variant}" xmlns="http://www.w3.org/2000/svg">
  <path d="1 1 0 0"></path>
</symbol>`;
  }

  async function validate(
    name: string,
    expectedHref?: string,
    size?: number,
    variant?: SkyIconVariantType,
    expectedError?: string,
  ): Promise<void> {
    const hrefPromise = resolverSvc.resolveHref(name, size, variant);

    if (expectedError) {
      await expectAsync(hrefPromise).toBeRejectedWithError(expectedError);
    } else if (expectedHref) {
      await expectAsync(hrefPromise).toBeResolvedTo(expectedHref);
    }

    // Fetch should only be called once per instance of the resolver service
    // and the result shared across subsequent calls to resolveHref().
    expect(fetchMock).toHaveBeenCalledOnceWith(
      'https://sky.blackbaudcdn.net/static/skyux-icons/10/assets/svg/skyux-icons.svg',
    );
  }

  beforeAll(() => {
    fetchMock = spyOn(window, 'fetch').and.resolveTo(
      new Response(
        `<svg id="sky-icon-svg-sprite" width="0" height="0" style="position:absolute">
    ${buildSymbolHtml('single-size', 12, 'line')}
    ${buildSymbolHtml('single-size', 12, 'solid')}
    ${buildSymbolHtml('multi-size', 12, 'line')}
    ${buildSymbolHtml('multi-size', 12, 'solid')}
    ${buildSymbolHtml('multi-size', 24, 'line')}
    ${buildSymbolHtml('multi-size', 24, 'solid')}
    ${buildSymbolHtml('multi-size', 48, 'line')}
    ${buildSymbolHtml('multi-size', 48, 'solid')}
  </svg>`,
      ),
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyIconSvgResolverService],
    });

    resolverSvc = TestBed.inject(SkyIconSvgResolverService);
  });

  afterEach(() => {
    document.getElementById('sky-icon-svg-sprite')?.remove();
  });

  it('should resolve the expected variant', async () => {
    await validate('single-size', '#sky-i-single-size-12-line', 12, 'line');
    await validate('single-size', '#sky-i-single-size-12-solid', 12, 'solid');
  });

  it('should throw an error when a matching icon is not found', async () => {
    await validate(
      'invalid',
      undefined,
      undefined,
      undefined,
      `Icon with name 'invalid' was not found.`,
    );
  });

  describe('with single size icons', () => {
    it('should resolve the expected icon regardless of specified size', async () => {
      await validate('single-size', '#sky-i-single-size-12-line');
      await validate('single-size', '#sky-i-single-size-12-line', 1);
      await validate('single-size', '#sky-i-single-size-12-line', 100);
    });
  });

  describe('with multiple size icons', () => {
    it('should resolve to the icon size that is an exact match of the specified size', async () => {
      await validate('multi-size', '#sky-i-multi-size-12-line', 12);
    });

    it('should resolve to the icon size closest to the specified size when no exact match exists', async () => {
      await validate('multi-size', '#sky-i-multi-size-12-line', -Infinity);
      await validate('multi-size', '#sky-i-multi-size-12-line', -1);
      await validate('multi-size', '#sky-i-multi-size-12-line', 0);
      await validate('multi-size', '#sky-i-multi-size-12-line', 11);
      await validate('multi-size', '#sky-i-multi-size-12-line', 13);
      await validate('multi-size', '#sky-i-multi-size-12-line', 17);
      await validate('multi-size', '#sky-i-multi-size-24-line', 18);
      await validate('multi-size', '#sky-i-multi-size-24-line', 20);
      await validate('multi-size', '#sky-i-multi-size-48-line', 37);
      await validate('multi-size', '#sky-i-multi-size-48-line', 100);
      await validate('multi-size', '#sky-i-multi-size-48-line', Infinity);
    });

    it('should resolve to the icon size closest to the default size when size is not specified', async () => {
      await validate('multi-size', '#sky-i-multi-size-12-line');
    });
  });
});
