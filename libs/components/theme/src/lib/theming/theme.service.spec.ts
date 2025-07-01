import { Renderer2 } from '@angular/core';

import { SkyTheme } from './theme';
import { SkyThemeBrand } from './theme-brand';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettings } from './theme-settings';
import { SkyThemeSpacing } from './theme-spacing';
import { SkyThemeService } from './theme.service';

describe('Theme service', () => {
  let mockHostEl: {
    foo: string;
  };
  let mockLinkElement: {
    href: string;
  };
  let mockRenderer: {
    addClass: jasmine.Spy;
    appendChild: jasmine.Spy;
    createElement: jasmine.Spy;
    removeClass: jasmine.Spy;
    removeChild: jasmine.Spy;
    setProperty: jasmine.Spy;
  };

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

  // eslint-disable-next-line complexity
  function validateBrand(
    current: SkyThemeSettings,
    previous?: SkyThemeSettings,
  ): void {
    if (current.brand?.name) {
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        current.brand.hostClass,
      );

      if (!previous?.brand?.name) {
        expect(mockRenderer.addClass).toHaveBeenCalledWith(
          mockHostEl,
          `sky-theme-brand-base`,
        );

        if (current.brand.name !== 'blackbaud') {
          expect(mockRenderer.createElement).toHaveBeenCalledWith('link');
          expect(mockRenderer.setProperty).toHaveBeenCalledWith(
            mockLinkElement,
            'rel',
            'stylesheet',
          );
          expect(mockRenderer.setProperty).toHaveBeenCalledWith(
            mockLinkElement,
            'href',
            `https://sky.blackbaudcdn.net/static/skyux-brand-${current.brand.name}/${current.brand.version}/assets/scss/${current.brand.name}.css`,
          );
          expect(mockRenderer.appendChild).toHaveBeenCalledWith(
            mockHostEl,
            mockLinkElement,
          );
        } else {
          expect(mockRenderer.createElement).not.toHaveBeenCalled();
          expect(mockRenderer.setProperty).not.toHaveBeenCalled();
          expect(mockRenderer.appendChild).not.toHaveBeenCalled();
        }
      }
    } else {
      expect(mockRenderer.addClass).not.toHaveBeenCalledWith(
        mockHostEl,
        current.brand?.hostClass,
      );
      expect(mockRenderer.addClass).not.toHaveBeenCalledWith(
        mockHostEl,
        `sky-theme-brand-base`,
      );

      if (previous?.brand?.name) {
        expect(mockRenderer.removeClass).toHaveBeenCalledWith(
          mockHostEl,
          previous.brand.hostClass,
        );
        expect(mockRenderer.removeClass).toHaveBeenCalledWith(
          mockHostEl,
          'sky-theme-brand-base',
        );
        if (previous.brand.name !== 'blackbaud') {
          expect(mockRenderer.removeChild).toHaveBeenCalledWith(
            mockHostEl,
            mockLinkElement,
          );
        } else {
          expect(mockRenderer.removeChild).not.toHaveBeenCalled();
        }
      }
    }
  }

  function validateInitError(fn: () => unknown): void {
    expect(fn).toThrowError(
      'Theme service is not initialized. Call init() first.',
    );
  }

  beforeEach(() => {
    mockRenderer = jasmine.createSpyObj('mockRenderer', [
      'addClass',
      'appendChild',
      'createElement',
      'removeClass',
      'removeChild',
      'setProperty',
    ]);

    mockHostEl = {
      foo: 'bar',
    };
    mockLinkElement = {
      href: 'moo',
    };

    mockRenderer.createElement.and.returnValue(mockLinkElement);
  });

  describe('init()', () => {
    it('should not apply an unsupported mode', () => {
      const themeSvc = new SkyThemeService();

      const settings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.dark,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      validateSettingsApplied(settings);
    });

    it('should apply supported spacing', () => {
      const themeSvc = new SkyThemeService();

      const settings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      validateSettingsApplied(settings);
    });

    it('should apply the initial theme', () => {
      const themeSvc = new SkyThemeService();

      const settings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.dark,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      validateSettingsApplied(settings);

      themeSvc.settingsChange.subscribe((settingsChange) => {
        expect(settingsChange.currentSettings).toBe(settings);
        expect(settingsChange.previousSettings).toBeUndefined();
      });
    });

    it('should not apply unsupported spacing', () => {
      const themeSvc = new SkyThemeService();

      const settings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
      );

      themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

      validateSettingsApplied(settings);
    });

    it('should throw an error if branding is requested for a theme which does not support branding', () => {
      const themeSvc = new SkyThemeService();

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
  });

  describe('setTheme()', () => {
    describe('with SkyThemeSettings parameter', () => {
      it('should error if settings are attempted to be changed prior to initialization', () => {
        const themeSvc = new SkyThemeService();

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
        const themeSvc = new SkyThemeService();

        let settings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.dark,
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          settings,
        );

        let expectedCurrentSettings = settings;
        let expectedPreviousSettings: SkyThemeSettings | undefined = undefined;

        themeSvc.settingsChange.subscribe((settingsChange) => {
          expect(settingsChange.currentSettings).toBe(expectedCurrentSettings);
          expect(settingsChange.previousSettings).toBe(
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

        expectedCurrentSettings = newSettings;
        expectedPreviousSettings = settings;

        themeSvc.setTheme(newSettings);

        settings = newSettings;

        newSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.compact,
        );

        expectedCurrentSettings = newSettings;
        expectedPreviousSettings = settings;

        themeSvc.setTheme(newSettings);
      });

      it('should not remove the host class if the theme settings have not changed', () => {
        const themeSvc = new SkyThemeService();

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
        const themeSvc = new SkyThemeService();

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
        const themeSvc = new SkyThemeService();

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
        const themeSvc = new SkyThemeService();
        const sriHash = 'sha384-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef';

        const settingsWithBrandingSri = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.compact,
          new SkyThemeBrand('rainbow', '1.0.1', undefined, sriHash),
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          settingsWithBrandingSri,
        );

        // Validate basic branding is applied
        validateSettingsApplied(settingsWithBrandingSri);

        // Validate SRI-specific attributes are set
        expect(mockRenderer.setProperty).toHaveBeenCalledWith(
          mockLinkElement,
          'integrity',
          sriHash,
        );
        expect(mockRenderer.setProperty).toHaveBeenCalledWith(
          mockLinkElement,
          'crossorigin',
          'anonymous',
        );
      });

      it('should apply branding without SRI attributes when no SRI hash is provided', () => {
        const themeSvc = new SkyThemeService();

        const settingsWithBrandingNoSri = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.compact,
          new SkyThemeBrand('rainbow', '1.0.1'),
        );

        themeSvc.init(
          mockHostEl,
          mockRenderer as unknown as Renderer2,
          settingsWithBrandingNoSri,
        );

        // Validate basic branding is applied
        validateSettingsApplied(settingsWithBrandingNoSri);

        // Validate SRI-specific attributes are NOT set
        expect(mockRenderer.setProperty).not.toHaveBeenCalledWith(
          mockLinkElement,
          'integrity',
          jasmine.any(String),
        );
        expect(mockRenderer.setProperty).not.toHaveBeenCalledWith(
          mockLinkElement,
          'crossorigin',
          'anonymous',
        );
      });
    });

    describe('with SkyTheme parameter', () => {
      it('should update only the theme while preserving other settings', () => {
        const themeSvc = new SkyThemeService();

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
        validateInitError(() =>
          new SkyThemeService().setTheme(SkyTheme.presets.modern),
        );
      });

      it('should remove brand when switching to a theme that does not support branding', () => {
        const themeSvc = new SkyThemeService();

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
        mockRenderer.removeChild.calls.reset();

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

        expect(mockRenderer.removeClass).toHaveBeenCalledWith(
          mockHostEl,
          initialSettings.brand?.hostClass,
        );
        expect(mockRenderer.removeClass).toHaveBeenCalledWith(
          mockHostEl,
          'sky-theme-brand-base',
        );
        expect(mockRenderer.removeChild).toHaveBeenCalledWith(
          mockHostEl,
          mockLinkElement,
        );
      });

      it('should maintain brand when switching to a theme that supports branding', () => {
        const themeSvc = new SkyThemeService();

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
    });
  });

  describe('destroy()', () => {
    it('should complete the settings change event when destroyed.', () => {
      const themeSvc = new SkyThemeService();

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
  });

  describe('setThemeMode()', () => {
    it('should update only the theme mode while preserving other settings', () => {
      const themeSvc = new SkyThemeService();

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
      validateInitError(() =>
        new SkyThemeService().setThemeMode(SkyThemeMode.presets.dark),
      );
    });

    it('should throw error when mode is not supported by current theme', () => {
      const themeSvc = new SkyThemeService();

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
      const themeSvc = new SkyThemeService();

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
        new SkyThemeService().setThemeSpacing(SkyThemeSpacing.presets.compact),
      );
    });

    it('should throw error when spacing is not supported by current theme', () => {
      const themeSvc = new SkyThemeService();

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
    it('should update only the theme brand while preserving other settings', () => {
      const themeSvc = new SkyThemeService();

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

      mockRenderer.addClass.calls.reset();
      mockRenderer.removeClass.calls.reset();
      mockRenderer.createElement.calls.reset();

      const newBrand = new SkyThemeBrand('rainbow', '1.0.1');
      themeSvc.setThemeBrand(newBrand);

      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        'sky-theme-brand-base',
      );
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        newBrand.hostClass,
      );
    });

    it('should throw error if called before initialization', () => {
      validateInitError(() =>
        new SkyThemeService().setThemeBrand(
          new SkyThemeBrand('rainbow', '1.0.1'),
        ),
      );
    });

    it('should throw error if branding is not supported by the current theme', () => {
      const themeSvc = new SkyThemeService();

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
      const themeSvc = new SkyThemeService();
      const sriHash = 'sha384-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef';

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

      mockRenderer.addClass.calls.reset();
      mockRenderer.removeClass.calls.reset();
      mockRenderer.createElement.calls.reset();
      mockRenderer.setProperty.calls.reset();

      const newBrandWithSri = new SkyThemeBrand('rainbow', '1.0.1', undefined, sriHash);
      themeSvc.setThemeBrand(newBrandWithSri);

      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        'sky-theme-brand-base',
      );
      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockHostEl,
        newBrandWithSri.hostClass,
      );

      // Validate SRI-specific attributes are set
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        mockLinkElement,
        'integrity',
        sriHash,
      );
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        mockLinkElement,
        'crossorigin',
        'anonymous',
      );
    });
  });
});
