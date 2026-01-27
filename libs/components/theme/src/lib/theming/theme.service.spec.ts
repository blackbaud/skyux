import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SkyTheme } from './theme';
import { SkyThemeBrand } from './theme-brand';
import { SkyThemeBrandService } from './theme-brand.service';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettings } from './theme-settings';
import { SkyThemeSpacing } from './theme-spacing';
import { SkyThemeService } from './theme.service';

describe('Theme service', () => {
  let mockHostEl: {
    foo: string;
  };
  let mockRenderer: {
    addClass: jasmine.Spy;
    removeClass: jasmine.Spy;
  };
  let mockBrandService: jasmine.SpyObj<SkyThemeBrandService>;
  let themeSvc: SkyThemeService;

  const blackbaudBrand = new SkyThemeBrand('blackbaud', '1.0.0');

  function validateSettingsApplied(
    current: SkyThemeSettings,
    previous?: SkyThemeSettings,
  ): void {
    validateThemeClass(current);
    validateModeClass(current);
    validateSpacingClass(current);
    validateBrand(current, previous);
  }

  function validateThemeClass(
    current: SkyThemeSettings,
    previous?: SkyThemeSettings,
  ): void {
    expect(mockRenderer.addClass).toHaveBeenCalledWith(
      mockHostEl,
      current.theme.hostClass,
    );

    if (previous) {
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockHostEl,
        previous.theme.hostClass,
      );
    }
  }

  function validateModeClass(current: SkyThemeSettings): void {
    if (current.theme.supportedModes.includes(current.mode)) {
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        current.mode.hostClass,
      );
    } else {
      expect(mockRenderer.addClass).not.toHaveBeenCalledWith(
        mockHostEl,
        current.mode.hostClass,
      );
    }
  }

  function validateSpacingClass(current: SkyThemeSettings): void {
    if (current.theme.supportedSpacing.includes(current.spacing)) {
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        current.spacing.hostClass,
      );
    } else {
      expect(mockRenderer.addClass).not.toHaveBeenCalledWith(
        mockHostEl,
        current.spacing.hostClass,
      );
    }
  }

  function validateBrand(
    current: SkyThemeSettings,
    previous?: SkyThemeSettings,
  ): void {
    // Validate that the brand service updateBrand method was called with correct parameters. When no brand is given - Blackbaud is the default
    expect(mockBrandService.updateBrand).toHaveBeenCalledWith(
      jasmine.any(Object),
      mockRenderer as unknown as Renderer2,
      current.brand ??
        (current.theme === SkyTheme.presets.modern
          ? new SkyThemeBrand('blackbaud', '1.0.0')
          : undefined),
      previous?.brand,
    );
  }

  function validateInitError(fn: () => unknown): void {
    expect(fn).toThrowError(
      'Theme service is not initialized. Call init() first.',
    );
  }

  beforeEach(() => {
    mockRenderer = jasmine.createSpyObj('Renderer2', [
      'addClass',
      'removeClass',
    ]);

    mockBrandService = jasmine.createSpyObj('SkyThemeBrandService', [
      'updateBrand',
      'registerBrand',
      'unregisterBrand',
      'destroy',
    ]);
    mockHostEl = {
      foo: 'bar',
    };

    TestBed.configureTestingModule({
      providers: [
        SkyThemeService,
        { provide: SkyThemeBrandService, useValue: mockBrandService },
      ],
    });

    themeSvc = TestBed.inject(SkyThemeService);
  });

  describe('init()', () => {
    it('should not apply an unsupported mode', () => {
      const settings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.dark,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      validateSettingsApplied(settings);
    });

    it('should apply supported spacing', () => {
      const settings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      validateSettingsApplied(settings);
    });

    it('should apply the initial theme', () => {
      const settings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.dark,
        SkyThemeSpacing.presets.standard,
        blackbaudBrand,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      validateSettingsApplied(settings);

      themeSvc.settingsChange.subscribe((settingsChange) => {
        expect(settingsChange.currentSettings).toEqual(settings);
        expect(settingsChange.previousSettings).toBeUndefined();
      });
    });

    it('should not apply unsupported spacing', () => {
      const settings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      validateSettingsApplied(settings);
    });

    it('should throw an error if branding is requested for a theme which does not support branding', () => {
      const settingsWithBranding = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
        undefined,
        new SkyThemeBrand('rainbow', '1.0.1'),
      );

      expect(() => {
        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          settingsWithBranding,
        );
      }).toThrowError('Branding is not supported for the given theme.');
    });

    it('should throw an error if branding is changed for a theme which does not support branding', () => {
      const settingsWithoutBranding = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        settingsWithoutBranding,
      );

      expect(() => {
        themeSvc.setThemeBrand(new SkyThemeBrand('rainbow', '1.0.1'));
      }).toThrowError('Branding is not supported for the given theme.');
    });

    it('should not throw an error if branding is changed for a theme which does not support branding but undefined is given for the brand', () => {
      const settingsWithoutBranding = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        settingsWithoutBranding,
      );

      expect(() => {
        themeSvc.setThemeBrand(undefined);
      }).not.toThrowError();
    });

    it('should register initial brands when provided', () => {
      const brand1 = new SkyThemeBrand('brand1', '1.0.0');
      const brand2 = new SkyThemeBrand('brand2', '1.0.0');
      const registeredBrands = [brand1, brand2];

      const settings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        settings,
        registeredBrands,
      );

      expect(mockBrandService.registerBrand).toHaveBeenCalledWith(brand1);
      expect(mockBrandService.registerBrand).toHaveBeenCalledWith(brand2);
    });
  });

  describe('setTheme()', () => {
    describe('with SkyThemeSettings parameter', () => {
      function testBrandingWithSri(sriHash?: string): void {
        const settingsWithBranding = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.compact,
          new SkyThemeBrand('rainbow', '1.0.1', undefined, undefined, sriHash),
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          settingsWithBranding,
        );

        // Validate basic branding is applied
        validateSettingsApplied(settingsWithBranding);
      }

      it('should error if settings are attempted to be changed prior to initialization', () => {
        const settings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.dark,
        );

        expect(() => {
          themeSvc.setTheme(settings);
        }).toThrowError(
          'Renderer is not initialized. Have you called the theme service `init` method?',
        );
      });

      it('should fire the settings change event as settings are applied', () => {
        let settings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.dark,
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          settings,
        );

        let expectedCurrentSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.dark,
          undefined,
          blackbaudBrand,
        );
        let expectedPreviousSettings: SkyThemeSettings | undefined = undefined;

        themeSvc.settingsChange.subscribe((settingsChange) => {
          expect(settingsChange.currentSettings).toEqual(
            expectedCurrentSettings,
          );

          expect(settingsChange.previousSettings).toEqual(
            expectedPreviousSettings,
          );

          validateSettingsApplied(
            settingsChange.currentSettings,
            settingsChange.previousSettings,
          );
        });

        let newSettings = new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        );

        expectedPreviousSettings = expectedCurrentSettings;
        expectedCurrentSettings = newSettings;

        themeSvc.setTheme(newSettings);

        settings = newSettings;

        newSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.compact,
        );

        expectedPreviousSettings = expectedCurrentSettings;
        expectedCurrentSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.compact,
          blackbaudBrand,
        );

        themeSvc.setTheme(newSettings);
      });

      it('should not remove the host class if the theme settings have not changed', () => {
        const settings = new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.dark,
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          settings,
        );

        themeSvc.setTheme(settings);

        expect(mockRenderer.removeClass).not.toHaveBeenCalled();
      });

      it('should apply branding', () => {
        const settingsWithBranding = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.compact,
          new SkyThemeBrand('rainbow', '1.0.1'),
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          settingsWithBranding,
        );

        validateSettingsApplied(settingsWithBranding);
        mockRenderer.addClass.calls.reset();
        mockRenderer.removeClass.calls.reset();

        const settingsWithoutBranding = new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.dark,
        );

        themeSvc.setTheme(settingsWithoutBranding);

        validateSettingsApplied(settingsWithoutBranding, settingsWithBranding);
      });

      it('should apply branding (blackbaud brand)', () => {
        const settingsWithBranding = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.compact,
          new SkyThemeBrand('blackbaud', '1.0.0'),
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          settingsWithBranding,
        );

        validateSettingsApplied(settingsWithBranding);
        mockRenderer.addClass.calls.reset();
        mockRenderer.removeClass.calls.reset();

        const settingsWithoutBranding = new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.dark,
        );

        themeSvc.setTheme(settingsWithoutBranding);

        validateSettingsApplied(settingsWithoutBranding, settingsWithBranding);
      });

      it('should apply branding with SRI hash', () => {
        const sriHash =
          'sha384-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef';
        testBrandingWithSri(sriHash);
      });

      it('should apply branding without SRI attributes when no SRI hash is provided', () => {
        testBrandingWithSri();
      });

      it('should apply branding without SRI attributes when empty SRI hash is provided', () => {
        testBrandingWithSri('');
      });
    });

    describe('with SkyTheme parameter', () => {
      it('should update only the theme while preserving other settings', () => {
        const initialSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.standard,
          new SkyThemeBrand('blackbaud', '1.0.0'),
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          initialSettings,
        );

        mockRenderer.addClass.calls.reset();
        mockRenderer.removeClass.calls.reset();

        let capturedSettings: SkyThemeSettings | undefined;
        themeSvc.settingsChange.subscribe((settingsChange) => {
          capturedSettings = settingsChange.currentSettings;
        });

        const newTheme = SkyTheme.presets.default;
        themeSvc.setTheme(newTheme);

        expect(capturedSettings).toEqual(
          jasmine.objectContaining({
            ...initialSettings,
            brand: undefined,
            theme: newTheme,
          }),
        );

        expect(mockRenderer.removeClass).toHaveBeenCalledWith(
          mockHostEl,
          SkyTheme.presets.modern.hostClass,
        );
        expect(mockRenderer.addClass).toHaveBeenCalledWith(
          mockHostEl,
          newTheme.hostClass,
        );
      });

      it('should throw error if called before initialization', () => {
        validateInitError(() => themeSvc.setTheme(SkyTheme.presets.modern));
      });

      it('should remove brand when switching to a theme that does not support branding', () => {
        const initialSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.compact,
          new SkyThemeBrand('rainbow', '1.0.1'),
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          initialSettings,
        );

        mockBrandService.updateBrand.calls.reset();

        let capturedSettings: SkyThemeSettings | undefined;
        themeSvc.settingsChange.subscribe((settingsChange) => {
          capturedSettings = settingsChange.currentSettings;
        });

        const newTheme = SkyTheme.presets.default; // This theme doesn't support branding
        themeSvc.setTheme(newTheme);

        expect(capturedSettings).toEqual(
          jasmine.objectContaining({
            ...initialSettings,
            brand: undefined,
            theme: newTheme,
          }),
        );

        // Should call updateBrand to remove branding since new theme doesn't support it
        expect(mockBrandService.updateBrand).toHaveBeenCalledWith(
          jasmine.any(Object),
          mockRenderer as unknown as Renderer2,
          undefined,
          initialSettings.brand,
        );
      });

      it('should maintain brand when switching to a theme that supports branding', () => {
        const initialSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.compact,
          new SkyThemeBrand('rainbow', '1.0.1'),
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          initialSettings,
        );

        let capturedSettings: SkyThemeSettings | undefined;
        themeSvc.settingsChange.subscribe((settingsChange) => {
          capturedSettings = settingsChange.currentSettings;
        });

        const newTheme = new SkyTheme(
          'branding-test',
          'sky-theme-branding-test',
          [SkyThemeMode.presets.light],
          [SkyThemeSpacing.presets.standard],
          true,
        );

        themeSvc.setTheme(newTheme);

        expect(capturedSettings).toEqual(
          jasmine.objectContaining({
            ...initialSettings,
            theme: newTheme,
          }),
        );
      });

      it('should add the default blackbaud brand when switching from a brandless theme to modern theme', () => {
        const initialSettings = new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.standard,
          undefined,
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          initialSettings,
        );

        let capturedSettings: SkyThemeSettings | undefined;
        themeSvc.settingsChange.subscribe((settingsChange) => {
          capturedSettings = settingsChange.currentSettings;
        });

        const newTheme = SkyTheme.presets.modern;

        themeSvc.setTheme(newTheme);

        expect(capturedSettings).toEqual(
          jasmine.objectContaining({
            ...initialSettings,
            theme: newTheme,
            brand: blackbaudBrand,
          }),
        );
      });

      it('should not add the default blackbaud brand when switching from a brandless theme to a theme that supports brand but is not modern', () => {
        const initialSettings = new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.standard,
          undefined,
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          initialSettings,
        );

        let capturedSettings: SkyThemeSettings | undefined;
        themeSvc.settingsChange.subscribe((settingsChange) => {
          capturedSettings = settingsChange.currentSettings;
        });

        const newTheme = new SkyTheme(
          'thirdtheme',
          'sky-theme-three',
          [SkyThemeMode.presets.light],
          [SkyThemeSpacing.presets.standard],
          true,
        );

        themeSvc.setTheme(newTheme);

        expect(capturedSettings).toEqual(
          jasmine.objectContaining({
            ...initialSettings,
            theme: newTheme,
          }),
        );
      });
    });
  });

  describe('destroy()', () => {
    it('should complete the settings change event when destroyed.', () => {
      const settings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.dark,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      const sub = themeSvc.settingsChange.subscribe();

      expect(sub.closed).toBe(false);

      themeSvc.destroy();

      expect(sub.closed).toBe(true);
    });

    it('should call brand service destroy when destroyed', () => {
      const settings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.dark,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      themeSvc.destroy();

      expect(mockBrandService.destroy).toHaveBeenCalled();
    });
  });

  describe('setThemeMode()', () => {
    it('should update only the theme mode while preserving other settings', () => {
      const initialSettings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
        new SkyThemeBrand('rainbow', '1.0.1'),
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        initialSettings,
      );

      mockRenderer.addClass.calls.reset();
      mockRenderer.removeClass.calls.reset();

      let capturedSettings: SkyThemeSettings | undefined;
      themeSvc.settingsChange.subscribe((settingsChange) => {
        capturedSettings = settingsChange.currentSettings;
      });

      const newMode = SkyThemeMode.presets.dark;
      themeSvc.setThemeMode(newMode);

      expect(capturedSettings).toEqual(
        jasmine.objectContaining({
          ...initialSettings,
          mode: newMode,
        }),
      );

      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockHostEl,
        SkyThemeMode.presets.light.hostClass,
      );
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        newMode.hostClass,
      );
    });

    it('should throw error if called before initialization', () => {
      validateInitError(() => themeSvc.setThemeMode(SkyThemeMode.presets.dark));
    });

    it('should throw error when mode is not supported by current theme', () => {
      const settings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      expect(() => {
        themeSvc.setThemeMode(SkyThemeMode.presets.dark);
      }).toThrowError('The current theme does not support the specified mode.');
    });
  });

  describe('setThemeSpacing()', () => {
    it('should update only the theme spacing while preserving other settings', () => {
      const initialSettings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.standard,
        new SkyThemeBrand('rainbow', '1.0.1'),
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        initialSettings,
      );

      mockRenderer.addClass.calls.reset();
      mockRenderer.removeClass.calls.reset();

      const newSpacing = SkyThemeSpacing.presets.compact;
      themeSvc.setThemeSpacing(newSpacing);

      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockHostEl,
        SkyThemeSpacing.presets.standard.hostClass,
      );
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        newSpacing.hostClass,
      );
    });

    it('should throw error if called before initialization', () => {
      validateInitError(() =>
        themeSvc.setThemeSpacing(SkyThemeSpacing.presets.compact),
      );
    });

    it('should throw error when spacing is not supported by current theme', () => {
      const settings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      expect(() => {
        themeSvc.setThemeSpacing(SkyThemeSpacing.presets.compact);
      }).toThrowError(
        'The current theme does not support the specified spacing.',
      );
    });
  });

  describe('setThemeBrand()', () => {
    function testClearBrand(brandName: string): void {
      const brand = new SkyThemeBrand(brandName, '1.0.0');

      const initialSettingsWithBrand = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
        brand,
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        initialSettingsWithBrand,
      );

      // Verify brand was applied initially
      expect(mockBrandService.updateBrand).toHaveBeenCalledWith(
        jasmine.any(Object),
        mockRenderer as unknown as Renderer2,
        brand,
        undefined,
      );

      // Reset calls to focus on clearing the brand
      mockBrandService.updateBrand.calls.reset();

      let capturedSettings: SkyThemeSettings | undefined;
      themeSvc.settingsChange.subscribe((settingsChange) => {
        capturedSettings = settingsChange.currentSettings;
      });

      // Clear the brand by setting it to undefined
      themeSvc.setThemeBrand(undefined);

      // Verify that the brand was cleared and set to the default
      expect(capturedSettings?.brand).toEqual(blackbaudBrand);

      // Verify that the brand service was called to update brand from existing to undefined
      expect(mockBrandService.updateBrand).toHaveBeenCalledWith(
        jasmine.any(Object),
        mockRenderer as unknown as Renderer2,
        new SkyThemeBrand('blackbaud', '1.0.0'),
        brand,
      );
    }

    it('should update only the theme brand while preserving other settings', () => {
      const initialSettings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        initialSettings,
      );

      mockBrandService.updateBrand.calls.reset();

      const newBrand = new SkyThemeBrand('rainbow', '1.0.1');
      themeSvc.setThemeBrand(newBrand);

      // Verify the brand service was called with the new brand
      expect(mockBrandService.updateBrand).toHaveBeenCalledWith(
        jasmine.any(Object),
        mockRenderer as unknown as Renderer2,
        newBrand,
        blackbaudBrand,
      );
    });

    it('should throw error if called before initialization', () => {
      validateInitError(() =>
        themeSvc.setThemeBrand(new SkyThemeBrand('rainbow', '1.0.1')),
      );
    });

    it('should throw error if branding is not supported by the current theme', () => {
      const initialSettings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        initialSettings,
      );

      expect(() => {
        themeSvc.setThemeBrand(new SkyThemeBrand('rainbow', '1.0.1'));
      }).toThrowError('Branding is not supported for the given theme.');
    });

    it('should apply brand with SRI hash using setThemeBrand', () => {
      const sriHash =
        'sha384-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef';

      const initialSettings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        initialSettings,
      );

      mockBrandService.updateBrand.calls.reset();

      const newBrandWithSri = new SkyThemeBrand(
        'rainbow',
        '1.0.1',
        undefined,
        undefined,
        sriHash,
      );
      themeSvc.setThemeBrand(newBrandWithSri);

      // Verify the brand service was called with the new brand (including SRI)
      expect(mockBrandService.updateBrand).toHaveBeenCalledWith(
        jasmine.any(Object),
        mockRenderer as unknown as Renderer2,
        newBrandWithSri,
        blackbaudBrand,
      );
    });

    it('should use styleUrl when provided for brand stylesheet', () => {
      const customStyleUrl = 'https://custom.example.com/theme.css';

      const settingsWithCustomStyleUrl = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
        new SkyThemeBrand('rainbow', '1.0.1', undefined, customStyleUrl),
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        settingsWithCustomStyleUrl,
      );

      // Validate that the brand service was called with the custom styleUrl brand
      expect(mockBrandService.updateBrand).toHaveBeenCalledWith(
        jasmine.any(Object),
        mockRenderer as unknown as Renderer2,
        settingsWithCustomStyleUrl.brand,
        undefined,
      );
    });

    it('should use styleUrl with SRI when both are provided', () => {
      const customStyleUrl = 'https://custom.example.com/theme.css';
      const sriHash = 'sha384-abc123';

      const settingsWithCustomStyleUrlAndSri = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
        new SkyThemeBrand(
          'rainbow',
          '1.0.1',
          undefined,
          customStyleUrl,
          sriHash,
        ),
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        settingsWithCustomStyleUrlAndSri,
      );

      // Validate that the brand service was called with the combined custom styleUrl + SRI brand
      expect(mockBrandService.updateBrand).toHaveBeenCalledWith(
        jasmine.any(Object),
        mockRenderer as unknown as Renderer2,
        settingsWithCustomStyleUrlAndSri.brand,
        undefined,
      );
    });

    it('should handle switching between brands', () => {
      const brand1 = new SkyThemeBrand('brand1', '1.0.0');
      const brand2 = new SkyThemeBrand('brand2', '1.0.0');

      const initialSettingsWithBrand1 = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
        brand1,
      );

      themeSvc.init(
        mockHostEl,
        mockRenderer as unknown as Renderer2,
        initialSettingsWithBrand1,
      );

      // Reset calls to focus on the brand switching
      mockBrandService.updateBrand.calls.reset();

      // Switch to brand2
      themeSvc.setThemeBrand(brand2);

      // Verify the brand service was called to switch from brand1 to brand2
      expect(mockBrandService.updateBrand).toHaveBeenCalledWith(
        jasmine.any(Object),
        mockRenderer as unknown as Renderer2,
        brand2,
        brand1,
      );
    });

    it('should reset to blackbaud brand when the brand is custom and setThemeBrand() is called with undefined', () => {
      testClearBrand('rainbow');
    });

    it('should stay blackbaud brand when brand is blackbaud and setThemeBrand() is called with undefined', () => {
      testClearBrand('blackbaud');
    });

    it('should allow setting a brand after clearing it with undefined', () => {
      const brand1 = new SkyThemeBrand('brand1', '1.0.0');
      const brand2 = new SkyThemeBrand('brand2', '1.0.0');

      const initialSettingsWithBrand = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
        brand1,
      );

      themeSvc.init(
        jasmine.any(Object),
        mockRenderer as unknown as Renderer2,
        initialSettingsWithBrand,
      );

      // Clear the brand
      themeSvc.setThemeBrand(undefined);

      // Reset calls to focus on setting the new brand
      mockBrandService.updateBrand.calls.reset();

      let capturedSettings: SkyThemeSettings | undefined;
      themeSvc.settingsChange.subscribe((settingsChange) => {
        capturedSettings = settingsChange.currentSettings;
      });

      // Set a new brand
      themeSvc.setThemeBrand(brand2);

      // Verify that the new brand was applied
      expect(capturedSettings?.brand).toBe(brand2);

      // Verify the brand service was called with the new brand. Previous brand would be Blackbaud due to that being the default when no brand is given
      expect(mockBrandService.updateBrand).toHaveBeenCalledWith(
        jasmine.any(Object),
        mockRenderer as unknown as Renderer2,
        brand2,
        blackbaudBrand,
      );
    });
  });

  describe('registerBrand()', () => {
    it('should call brand service registerBrand method', () => {
      const brand = new SkyThemeBrand('test-brand', '1.0.0');

      themeSvc.registerBrand(brand);

      expect(mockBrandService.registerBrand).toHaveBeenCalledWith(brand);
    });
  });

  describe('unregisterBrand()', () => {
    it('should call brand service unregisterBrand method', () => {
      const brandName = 'test-brand';

      themeSvc.unregisterBrand(brandName);

      expect(mockBrandService.unregisterBrand).toHaveBeenCalledWith(brandName);
    });
  });
});
