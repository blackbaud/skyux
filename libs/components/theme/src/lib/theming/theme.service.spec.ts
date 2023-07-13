import { SkyTheme } from './theme';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettings } from './theme-settings';
import { SkyThemeSpacing } from './theme-spacing';
import { SkyThemeService } from './theme.service';

describe('Theme service', () => {
  let mockHostEl: any;
  let mockRenderer: any;

  function validateSettingsApplied(
    current: SkyThemeSettings,
    previous?: SkyThemeSettings
  ): void {
    expect(mockRenderer.addClass).toHaveBeenCalledWith(
      mockHostEl,
      current.theme.hostClass
    );

    let addClassMatcher = expect(mockRenderer.addClass);

    if (current.theme.supportedModes.indexOf(current.mode) < 0) {
      addClassMatcher = addClassMatcher.not;
    }

    addClassMatcher = expect(mockRenderer.addClass);

    if (current.theme.supportedSpacing.indexOf(current.spacing) < 0) {
      addClassMatcher = addClassMatcher.not;
    }

    addClassMatcher.toHaveBeenCalledWith(mockHostEl, current.spacing.hostClass);

    if (previous) {
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockHostEl,
        previous.theme.hostClass
      );
    } else {
      expect(mockRenderer.removeClass).not.toHaveBeenCalled();
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
      SkyThemeMode.presets.dark
    );

    themeSvc.init(mockHostEl, mockRenderer, settings);

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
      SkyThemeMode.presets.dark
    );

    themeSvc.init(mockHostEl, mockRenderer, settings);

    let expectedCurrentSettings = settings;
    let expectedPreviousSettings: SkyThemeSettings | undefined = undefined;

    themeSvc.settingsChange.subscribe((settingsChange) => {
      expect(settingsChange.currentSettings).toBe(expectedCurrentSettings);
      expect(settingsChange.previousSettings).toBe(expectedPreviousSettings);

      validateSettingsApplied(
        settingsChange.currentSettings,
        settingsChange.previousSettings
      );
    });

    let newSettings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light
    );

    expectedCurrentSettings = newSettings;
    expectedPreviousSettings = settings;

    themeSvc.setTheme(newSettings);

    settings = newSettings;

    newSettings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.light,
      SkyThemeSpacing.presets.compact
    );

    expectedCurrentSettings = newSettings;
    expectedPreviousSettings = settings;

    themeSvc.setTheme(newSettings);
  });

  it('should not apply an unsupported mode', () => {
    const themeSvc = new SkyThemeService();

    const settings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.dark
    );

    themeSvc.init(mockHostEl, mockRenderer, settings);

    validateSettingsApplied(settings);
  });

  it('should not remove the host class if the theme settings have not changed', () => {
    const themeSvc = new SkyThemeService();

    const settings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.dark
    );

    themeSvc.init(mockHostEl, mockRenderer, settings);

    themeSvc.setTheme(settings);

    expect(mockRenderer.removeClass).not.toHaveBeenCalled();
  });

  it('should apply supported spacing', () => {
    const themeSvc = new SkyThemeService();

    const settings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.light,
      SkyThemeSpacing.presets.compact
    );

    themeSvc.init(mockHostEl, mockRenderer, settings);

    validateSettingsApplied(settings);
  });

  it('should not apply unsupported spacing', () => {
    const themeSvc = new SkyThemeService();

    const settings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light,
      SkyThemeSpacing.presets.compact
    );

    themeSvc.init(mockHostEl, mockRenderer, settings);

    validateSettingsApplied(settings);
  });

  it('should complete the settings change event when destroyed.', () => {
    const themeSvc = new SkyThemeService();

    const settings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.dark
    );

    themeSvc.init(mockHostEl, mockRenderer, settings);

    const sub = themeSvc.settingsChange.subscribe();

    expect(sub.closed).toBe(false);

    themeSvc.destroy();

    expect(sub.closed).toBe(true);
  });
});
