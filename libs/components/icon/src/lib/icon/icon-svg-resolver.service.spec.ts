import { HttpClientModule } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { SkyIconSvgResolverService } from './icon-svg-resolver.service';
import { SkyIconVariantType } from './types/icon-variant-type';

describe('Icon SVG resolver service', () => {
  let resolverSvc: SkyIconSvgResolverService;
  let httpTestingController: HttpTestingController;
  let spriteLoaded = false;

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
    expectedUrl: string,
    size?: number,
    variant?: SkyIconVariantType,
  ): Promise<void> {
    const urlPromise = firstValueFrom(
      resolverSvc.resolveId(name, size, variant),
    );

    if (!spriteLoaded) {
      const testRequest = httpTestingController.expectOne(
        'https://sky.blackbaudcdn.net/static/skyux-icons/7/assets/svg/skyux-icons.svg',
      );

      testRequest.flush(`<svg id="sky-icon-svg-sprite" width="0" height="0" style="position:absolute">
  ${buildSymbolHtml('single-size', 12, 'line')}
  ${buildSymbolHtml('single-size', 12, 'solid')}
  ${buildSymbolHtml('multi-size', 12, 'line')}
  ${buildSymbolHtml('multi-size', 12, 'solid')}
  ${buildSymbolHtml('multi-size', 24, 'line')}
  ${buildSymbolHtml('multi-size', 24, 'solid')}
  ${buildSymbolHtml('multi-size', 48, 'line')}
  ${buildSymbolHtml('multi-size', 48, 'solid')}
  ${buildSymbolHtml('multi-size-exact', 12, 'line')}
  ${buildSymbolHtml('multi-size-exact', 12, 'solid')}
  ${buildSymbolHtml('multi-size-exact', 16, 'line')}
  ${buildSymbolHtml('multi-size-exact', 16, 'solid')}
  ${buildSymbolHtml('multi-size-exact', 24, 'line')}
  ${buildSymbolHtml('multi-size-exact', 24, 'solid')}
  </svg>`);

      spriteLoaded = true;
    }

    await expectAsync(urlPromise).toBeResolvedTo(expectedUrl);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [provideHttpClientTesting(), SkyIconSvgResolverService],
    });

    resolverSvc = TestBed.inject(SkyIconSvgResolverService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    document.getElementById('sky-icon-svg-sprite')?.remove();
    spriteLoaded = false;
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
      await validate('multi-size-exact', '#sky-i-multi-size-exact-12-line', 12);
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
