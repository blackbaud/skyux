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
            {
              code: 16,
              faNames: ['fa-name1', 'fa-name2'],
              name: 'has-fa-2-line',
              usage: [],
            },

            {
              code: 17,
              faNames: ['fa-name1', 'fa-name2'],
              name: 'has-fa-2-solid',
              usage: [],
            },
            {
              code: 18,
              faNames: ['fa-name3'],
              name: 'has-fa-3',
              usage: [],
            },

            {
              code: 19,
              faNames: ['fa-name3'],
              name: 'has-fa-3-solid',
              usage: [],
            },
          ],
          additionalFluentIcons: [
            'fluent-icon-1, fluent-icon-2, fluent-icon-3',
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
        SkyThemeMode.presets.light,
      );
    });

    it('should resolve an icon that is not present in the manifest as a Font Awesome icon', () => {
      expect(svc.resolveIcon('foo', undefined, themeSettings)).toEqual({
        icon: 'foo',
        iconType: 'fa',
      });
    });

    it('should return a Font Awesome icon when a SKY UX icon is specified that has a Font Awesome equivalent', () => {
      expect(svc.resolveIcon('has-fa', undefined, themeSettings)).toEqual({
        icon: 'fa-name',
        iconType: 'fa',
      });
    });

    it('should return the correct Font Awesome icon even if specifying a variant for modern theme', () => {
      expect(svc.resolveIcon('has-fa-2', 'line', themeSettings)).toEqual({
        icon: 'fa-name1',
        iconType: 'fa',
      });

      expect(svc.resolveIcon('fa-name2', 'solid', themeSettings)).toEqual({
        icon: 'fa-name2',
        iconType: 'fa',
      });
    });

    it('should return a SKY UX icon when a SKY UX icon is specified that does not have a Font Awesome equivalent', () => {
      expect(svc.resolveIcon('no-fa', undefined, themeSettings)).toEqual({
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
        SkyThemeMode.presets.light,
      );
    });

    it('should resolve an icon by its name', () => {
      expect(svc.resolveIcon('no-variant', undefined, themeSettings)).toEqual({
        icon: 'no-variant',
        iconType: 'skyux',
      });
    });

    it('should fall back to the non-variant if the line variant does not exist', () => {
      expect(svc.resolveIcon('no-variant', 'line', themeSettings)).toEqual({
        icon: 'no-variant',
        iconType: 'skyux',
      });
    });

    it('should fall back to the non-variant if the solid variant does not exist', () => {
      expect(svc.resolveIcon('no-variant', 'solid', themeSettings)).toEqual({
        icon: 'no-variant',
        iconType: 'skyux',
      });
    });

    it('should fall back to the line variant if a non-variant does not exist', () => {
      expect(svc.resolveIcon('line-only', undefined, themeSettings)).toEqual({
        icon: 'line-only-line',
        iconType: 'skyux',
      });
    });

    it('should fall back to the line variant if a solid variant does not exist', () => {
      expect(svc.resolveIcon('line-only', 'solid', themeSettings)).toEqual({
        icon: 'line-only-line',
        iconType: 'skyux',
      });
    });

    it('should return the solid variant if it exists', () => {
      expect(svc.resolveIcon('widget', 'solid', themeSettings)).toEqual({
        icon: 'widget-solid',
        iconType: 'skyux',
      });
    });

    it('should return the correct variant when given a Font Awesome icon name', () => {
      // find the default icon variant
      expect(svc.resolveIcon('fa-name1', undefined, themeSettings)).toEqual({
        icon: 'has-fa-2-line',
        iconType: 'skyux',
      });

      // find the correct icon variant
      expect(svc.resolveIcon('fa-name2', 'solid', themeSettings)).toEqual({
        icon: 'has-fa-2-solid',
        iconType: 'skyux',
      });

      // find the correct "default" icon when no variant matching the request exists
      expect(svc.resolveIcon('fa-name3', 'line', themeSettings)).toEqual({
        icon: 'has-fa-3',
        iconType: 'skyux',
      });
    });

    it('should resolve an icon that is not present in the manifest as a Font Awesome icon', () => {
      expect(svc.resolveIcon('foo', undefined, themeSettings)).toEqual({
        icon: 'foo',
        iconType: 'fa',
      });
    });
  });
});
