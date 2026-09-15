import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SKY_ICON_SVG_URL, SkyLogService } from '@skyux/core';

import { SkyIconSvgResolverService } from './icon-svg-resolver.service';
import { SkyIconVariantType } from './types/icon-variant-type';

const DEFAULT_SVG_URL =
  'https://sky.blackbaudcdn.net/static/skyux-icons/10/assets/svg/skyux-icons.svg';

describe('Icon SVG resolver service', () => {
  let fetchMock: jasmine.Spy<typeof fetch>;
  let resolverSvc: SkyIconSvgResolverService;
  let logSvcSpy: jasmine.SpyObj<SkyLogService>;

  function buildSymbolHtml(
    name: string,
    size: number,
    variant: SkyIconVariantType,
    dark = false,
  ): string {
    const id = `sky-i-${name}-${size}-${variant}${dark ? '-dark' : ''}`;

    return `<symbol viewBox="0 0 ${size} ${size}" id="${id}" xmlns="http://www.w3.org/2000/svg">
  <path d="1 1 0 0"></path>
</symbol>`;
  }

  async function validate(
    name: string,
    expectedHref?: string,
    size?: number,
    variant?: SkyIconVariantType,
    expectedError?: string,
    expectedUrl = DEFAULT_SVG_URL,
    darkMode?: boolean,
  ): Promise<void> {
    const hrefPromise = resolverSvc.resolveHref(name, size, variant, darkMode);

    if (expectedError) {
      await expectAsync(hrefPromise).toBeRejectedWithError(expectedError);
    } else if (expectedHref) {
      await expectAsync(hrefPromise).toBeResolvedTo(expectedHref);
    }

    // Fetch should only be called once per instance of the resolver service
    // and the result shared across subsequent calls to resolveHref().
    expect(fetchMock).toHaveBeenCalledOnceWith(expectedUrl);
  }

  beforeAll(() => {
    fetchMock = spyOn(window, 'fetch');
  });

  beforeEach(() => {
    // Reset the fetch spy call count
    fetchMock.calls.reset();

    // Reset the fetch mock to return a fresh Response for each test
    fetchMock.and.resolveTo(
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
    ${buildSymbolHtml('multi-size', 24, 'line', true)}
    ${buildSymbolHtml('multi-size', 24, 'solid', true)}
    ${buildSymbolHtml('multi-size', 48, 'line', true)}
    ${buildSymbolHtml('multi-size', 48, 'solid', true)}
    ${buildSymbolHtml('themed', 12, 'line')}
    ${buildSymbolHtml('themed', 12, 'solid')}
    ${buildSymbolHtml('themed', 12, 'line', true)}
    ${buildSymbolHtml('themed', 12, 'solid', true)}
    ${buildSymbolHtml('light-only', 12, 'line')}
    ${buildSymbolHtml('light-only', 12, 'solid')}
    ${buildSymbolHtml('moon-dark', 12, 'line')}
    ${buildSymbolHtml('moon-dark', 12, 'solid')}
  </svg>`,
      ),
    );

    logSvcSpy = jasmine.createSpyObj<SkyLogService>('SkyLogService', ['warn']);

    TestBed.configureTestingModule({
      providers: [
        SkyIconSvgResolverService,
        { provide: SkyLogService, useValue: logSvcSpy },
      ],
    });

    resolverSvc = TestBed.inject(SkyIconSvgResolverService);
  });

  afterEach(() => {
    resolverSvc.resetIconMap();
    // Some tests insert more than one sprite (each sharing the same id), so
    // remove them all rather than only the first match.
    document
      .querySelectorAll('#sky-icon-svg-sprite')
      .forEach((el) => el.remove());
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

  it('should refresh the icon map when new icons are added to the sprite', async () => {
    // First, resolve an icon to ensure the icon map is initialized
    await expectAsync(
      resolverSvc.resolveHref('single-size', 12, 'line'),
    ).toBeResolvedTo('#sky-i-single-size-12-line');

    // Verify that a new icon doesn't exist yet
    await expectAsync(
      resolverSvc.resolveHref('new-icon', 16, 'line'),
    ).toBeRejectedWithError(`Icon with name 'new-icon' was not found.`);

    // Add a new icon to the existing sprite
    const spriteEl = document.getElementById('sky-icon-svg-sprite');
    spriteEl?.insertAdjacentHTML(
      'beforeend',
      buildSymbolHtml('new-icon', 16, 'line'),
    );

    // Refresh the icon map to pick up the new icon
    resolverSvc.refreshIconMap();

    // Verify the new icon can now be resolved
    await expectAsync(
      resolverSvc.resolveHref('new-icon', 16, 'line'),
    ).toBeResolvedTo('#sky-i-new-icon-16-line');
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

  describe('with dark mode requested', () => {
    it('should resolve the dark mode icon', async () => {
      await validate(
        'themed',
        '#sky-i-themed-12-line-dark',
        12,
        'line',
        undefined,
        undefined,
        true,
      );
      await validate(
        'themed',
        '#sky-i-themed-12-solid-dark',
        12,
        'solid',
        undefined,
        undefined,
        true,
      );
    });

    it('should resolve the default icon when dark mode is not requested', async () => {
      await validate('themed', '#sky-i-themed-12-line', 12, 'line');
      await validate(
        'themed',
        '#sky-i-themed-12-line',
        12,
        'line',
        undefined,
        undefined,
        false,
      );
    });

    it('should resolve the default icon when the icon has no dark mode version', async () => {
      await validate(
        'light-only',
        '#sky-i-light-only-12-line',
        12,
        'line',
        undefined,
        undefined,
        true,
      );
    });

    it('should prefer the dark mode icon over a nearer size in the default icon', async () => {
      // `multi-size` has an exact 12px match, but its dark mode version is only
      // available at 24px and 48px. Mode wins over size, so the nearest dark
      // mode size is used instead of the exact default-icon match.
      await validate(
        'multi-size',
        '#sky-i-multi-size-24-line-dark',
        12,
        'line',
        undefined,
        undefined,
        true,
      );
    });

    it('should resolve the size nearest the requested size among dark mode icons', async () => {
      await validate(
        'multi-size',
        '#sky-i-multi-size-24-line-dark',
        24,
        'line',
        undefined,
        undefined,
        true,
      );
      await validate(
        'multi-size',
        '#sky-i-multi-size-48-line-dark',
        40,
        'line',
        undefined,
        undefined,
        true,
      );
    });

    it('should throw an error when neither the default nor dark mode icon exists', async () => {
      await validate(
        'invalid',
        undefined,
        undefined,
        undefined,
        `Icon with name 'invalid' was not found.`,
        undefined,
        true,
      );
    });

    it('should not treat an icon whose name ends in "-dark" as a dark mode icon', async () => {
      // Only a trailing `-dark` segment marks the theme mode, so `moon-dark`
      // is a default icon that happens to end in `-dark` and resolves as-is.
      await validate(
        'moon-dark',
        '#sky-i-moon-dark-12-line',
        12,
        'line',
        undefined,
        undefined,
        true,
      );
    });
  });

  describe('with SKY_ICON_SVG_URL provided', () => {
    const customUrl = 'https://example.com/custom-icons.svg';

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          SkyIconSvgResolverService,
          { provide: SKY_ICON_SVG_URL, useValue: customUrl },
          { provide: SkyLogService, useValue: logSvcSpy },
        ],
      });

      resolverSvc = TestBed.inject(SkyIconSvgResolverService);
    });

    it('should fetch the icon sprite from the provided URL instead of the default', async () => {
      await validate(
        'single-size',
        '#sky-i-single-size-12-line',
        12,
        'line',
        undefined,
        customUrl,
      );
    });
  });

  it('should warn (but not throw) when a second instance is configured with a different SVG URL', async () => {
    const customUrl = 'https://example.com/different-icons.svg';

    // Establish the icon map via the default-configured instance.
    await expectAsync(
      resolverSvc.resolveHref('single-size', 12, 'line'),
    ).toBeResolvedTo('#sky-i-single-size-12-line');

    // The custom instance resolves SkyLogService from the same TestBed
    // injector (via its parent), so it shares `logSvcSpy`.
    // The warning should fire once, at construction time...
    const customResolverSvc = Injector.create({
      providers: [
        SkyIconSvgResolverService,
        { provide: SKY_ICON_SVG_URL, useValue: customUrl },
      ],
      parent: TestBed.inject(Injector),
    }).get(SkyIconSvgResolverService);

    expect(logSvcSpy.warn).toHaveBeenCalledOnceWith(
      `SkyIconSvgResolverService only supports one SKY_ICON_SVG_URL value per application. An icon sprite has already been loaded from '${DEFAULT_SVG_URL}', so a sprite will not also be loaded from '${customUrl}'.`,
    );

    // ...not repeatedly on every call to resolveHref(), which should still
    // resolve using whichever sprite was already loaded.
    await expectAsync(
      customResolverSvc.resolveHref('single-size', 12, 'line'),
    ).toBeResolvedTo('#sky-i-single-size-12-line');
    await expectAsync(
      customResolverSvc.resolveHref('single-size', 12, 'line'),
    ).toBeResolvedTo('#sky-i-single-size-12-line');

    expect(logSvcSpy.warn).toHaveBeenCalledTimes(1);

    // The second instance's URL should never have been fetched.
    expect(fetchMock).toHaveBeenCalledOnceWith(DEFAULT_SVG_URL);
  });
});
