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
  let mockRenderer: { addClass: jasmine.Spy; removeClass: jasmine.Spy };

  function validateSettingsApplied(
    current: SkyThemeSettings,
    previous?: SkyThemeSettings,
  ): void {
    validateThemeClass(current);
    validateModeClass(current);
    validateSpacingClass(current);
    validateBrandClass(current, previous);
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

  function validateBrandClass(
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
      }
    }
  }

  beforeEach(() => {
    mockRenderer = jasmine.createSpyObj('mockRenderer', [
      'addClass',
      'removeClass',
    ]);

    mockHostEl = {
      foo: 'bar',
    };
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

  it('should fire the settings change event as settings are applied', () => {
    const themeSvc = new SkyThemeService();

    let settings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.dark,
    );

    themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

    let expectedCurrentSettings = settings;
    let expectedPreviousSettings: SkyThemeSettings | undefined = undefined;

    themeSvc.settingsChange.subscribe((settingsChange) => {
      expect(settingsChange.currentSettings).toBe(expectedCurrentSettings);
      expect(settingsChange.previousSettings).toBe(expectedPreviousSettings);

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

  it('should not apply an unsupported mode', () => {
    const themeSvc = new SkyThemeService();

    const settings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.dark,
    );

    themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

    validateSettingsApplied(settings);
  });

  it('should not remove the host class if the theme settings have not changed', () => {
    const themeSvc = new SkyThemeService();

    const settings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.dark,
    );

    themeSvc.init(mockHostEl, mockRenderer as unknown as Renderer2, settings);

    themeSvc.setTheme(settings);

    expect(mockRenderer.removeClass).not.toHaveBeenCalled();
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

  it('should apply branding', () => {
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
