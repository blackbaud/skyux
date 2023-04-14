import { TestBed } from '@angular/core/testing';
import {
  SkyTheme,
  SkyThemeIconManifest,
  SkyThemeIconManifestService,
  SkyThemeMode,
  SkyThemeSettings,
} from '@skyux/theme';

import { SkyIconResolverService } from './icon-resolver.service';

describe('Icon resolver service', () => {
  let mockManifestSvc: Partial<SkyThemeIconManifestService>;
  let svc: SkyIconResolverService;

  beforeEach(() => {
    mockManifestSvc = {
      getManifest(): SkyThemeIconManifest {
        return {
          cssPrefix: 'test-',
          glyphs: [
            {
              code: 1,
              name: 'no-variant',
              usage: [],
            },
            {
              code: 10,
              name: 'widget',
              usage: [],
            },
            {
              code: 11,
              name: 'widget-solid',
              usage: [],
            },
            {
              code: 12,
              name: 'widget-line',
              usage: [],
            },
            {
              code: 13,
              name: 'line-only-line',
              usage: [],
            },
            {
              code: 14,
              faName: 'fa-name',
              name: 'has-fa',
              usage: [],
            },
            {
              code: 15,
              name: 'no-fa',
              usage: [],
            },
          ],
          name: 'test',
        };
      },
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyThemeIconManifestService,
          useValue: mockManifestSvc,
        },
      ],
    });

    svc = TestBed.inject(SkyIconResolverService);
  });

  describe('in default theme', () => {
    let themeSettings: SkyThemeSettings;

    beforeEach(() => {
      themeSettings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light
      );
    });

    it('should resolve an icon that is not present in the manifest as a Font Awesome icon', () => {
      expect(
        svc.resolveIcon('foo', undefined, undefined, themeSettings)
      ).toEqual({
        icon: 'foo',
        iconType: 'fa',
      });
    });

    it('should return a Font Awesome icon when a SKY UX icon is specified that has a Font Awesome equivalent', () => {
      expect(
        svc.resolveIcon('has-fa', undefined, 'skyux', themeSettings)
      ).toEqual({
        icon: 'fa-name',
        iconType: 'fa',
      });
    });

    it('should return a SKY UX icon when a SKY UX icon is specified that does not have a Font Awesome equivalent', () => {
      expect(
        svc.resolveIcon('no-fa', undefined, 'skyux', themeSettings)
      ).toEqual({
        icon: 'no-fa',
        iconType: 'skyux',
      });
    });
  });

  describe('with modern theme', () => {
    let themeSettings: SkyThemeSettings;

    beforeEach(() => {
      themeSettings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light
      );
    });

    it('should resolve an icon by its name', () => {
      expect(
        svc.resolveIcon('no-variant', undefined, 'skyux', themeSettings)
      ).toEqual({ icon: 'no-variant', iconType: 'skyux' });
    });

    it('should fall back to the non-variant if the line variant does not exist', () => {
      expect(
        svc.resolveIcon('no-variant', 'line', 'skyux', themeSettings)
      ).toEqual({
        icon: 'no-variant',
        iconType: 'skyux',
      });
    });

    it('should fall back to the non-variant if the solid variant does not exist', () => {
      expect(
        svc.resolveIcon('no-variant', 'solid', 'skyux', themeSettings)
      ).toEqual({
        icon: 'no-variant',
        iconType: 'skyux',
      });
    });

    it('should fall back to the line variant if a non-variant does not exist', () => {
      expect(
        svc.resolveIcon('line-only', undefined, 'skyux', themeSettings)
      ).toEqual({
        icon: 'line-only-line',
        iconType: 'skyux',
      });
    });

    it('should fall back to the line variant if a solid variant does not exist', () => {
      expect(
        svc.resolveIcon('line-only', 'solid', 'skyux', themeSettings)
      ).toEqual({
        icon: 'line-only-line',
        iconType: 'skyux',
      });
    });

    it('should return the solid variant if it exists', () => {
      expect(
        svc.resolveIcon('widget', 'solid', 'skyux', themeSettings)
      ).toEqual({
        icon: 'widget-solid',
        iconType: 'skyux',
      });
    });
  });
});
