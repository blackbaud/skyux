import {
  SkyThemeIconManifestService
} from '@skyux/theme';

import {
  SkyIconResolverService
} from './icon-resolver.service';

import {
  SkyIconVariant
} from './icon-variant';

describe('Icon resolver service', () => {

  let mockManfiestSvc: Partial<SkyThemeIconManifestService>;
  let svc: SkyIconResolverService;

  beforeEach(() => {
    mockManfiestSvc = {
      getManifest() {
        return {
          cssPrefix: 'test-',
          glyphs: [
            {
              code: 1,
              name: 'no-variant',
              usage: []
            },
            {
              code: 10,
              name: 'widget',
              usage: []
            },
            {
              code: 11,
              name: 'widget-solid',
              usage: []
            },
            {
              code: 12,
              name: 'widget-line',
              usage: []
            },
            {
              code: 13,
              name: 'line-only-line',
              usage: []
            }
          ],
          name: 'test'
        };
      }
    };

    svc = new SkyIconResolverService(mockManfiestSvc as any);
  });

  it('should resolve an icon by its name', () => {
    expect(svc.resolveIcon('no-variant')).toBe('no-variant');
  });

  it('should fall back to the non-variant if the line variant does not exist', () => {
    expect(svc.resolveIcon('no-variant', SkyIconVariant.Line)).toBe('no-variant');
  });

  it('should fall back to the non-variant if the solid variant does not exist', () => {
    expect(svc.resolveIcon('no-variant', SkyIconVariant.Solid)).toBe('no-variant');
  });

  it('should fall back to the line variant if a non-variant does not exist', () => {
    expect(svc.resolveIcon('line-only')).toBe('line-only-line');
  });

  it('should fall back to the line variant if a solid variant does not exist', () => {
    expect(svc.resolveIcon('line-only', SkyIconVariant.Solid)).toBe('line-only-line');
  });

  it('should return the solid variant if it exists', () => {
    expect(svc.resolveIcon('widget', SkyIconVariant.Solid)).toBe('widget-solid');
  });

});
