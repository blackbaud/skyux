import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSpacing,
} from '@skyux/theme';

import { ThemeSelectorModeValue } from './theme-selector-mode-value';
import { ThemeSelectorSpacingValue } from './theme-selector-spacing-value';
import { ThemeSelectorValue } from './theme-selector-value';

interface LocalStorageSettings {
  themeName: ThemeSelectorValue;
  themeMode: ThemeSelectorModeValue;
  themeSpacing: ThemeSelectorSpacingValue;
  modernV2Enabled: boolean | undefined;
}

const PREVIOUS_SETTINGS_KEY =
  'skyux-playground-theme-mode-spacing-selector-settings';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sky-theme-selector',
  standalone: true,
  imports: [FormsModule, SkyCheckboxModule, SkyIdModule, SkyInputBoxModule],
  templateUrl: './theme-selector.component.html',
})
export class SkyThemeSelectorComponent implements OnInit {
  public set themeName(value: ThemeSelectorValue | undefined) {
    const previousThemeName = this.#_themeName;
    this.#_themeName = value;

    if (value !== previousThemeName) {
      this.#updateThemeSettings();
    }
  }

  public get themeName(): ThemeSelectorValue | undefined {
    return this.#_themeName;
  }

  public set themeSpacing(value: ThemeSelectorSpacingValue | undefined) {
    const previous = this.#_themeSpacing;
    this.#_themeSpacing = value;

    if (value !== previous) {
      this.#updateThemeSettings();
    }
  }

  public get themeSpacing(): ThemeSelectorSpacingValue | undefined {
    return this.#_themeSpacing;
  }

  public set modernV2Enabled(value: boolean) {
    if (value !== this.#_modernV2Enabled) {
      this.#toggleModernV2Class(value);
    }
    this.#_modernV2Enabled = value;
    this.#updateThemeSettings();
  }

  public get modernV2Enabled(): boolean {
    return this.#_modernV2Enabled;
  }

  public set themeMode(value: ThemeSelectorModeValue | undefined) {
    const previous = this.#_themeMode;
    this.#_themeMode = value;

    if (value !== previous) {
      this.#updateThemeSettings();
    }
  }

  public get themeMode(): ThemeSelectorModeValue | undefined {
    return this.#_themeMode;
  }

  protected spacingValues: ThemeSelectorSpacingValue[] = [];

  protected modeValues: ThemeSelectorModeValue[] = [];

  #_modernV2Enabled = false;
  #_themeName: ThemeSelectorValue = 'default';
  #_themeSpacing: ThemeSelectorSpacingValue = 'standard';
  #_themeMode: ThemeSelectorModeValue = 'light';

  #currentThemeSettings: SkyThemeSettings;
  #renderer = inject(Renderer2);
  #themeSvc = inject(SkyThemeService);

  public ngOnInit(): void {
    const previousSettings = this.#getLastSettings();

    if (previousSettings) {
      try {
        this.themeName = previousSettings.themeName;
        this.themeMode = previousSettings.themeMode;
        this.themeSpacing = previousSettings.themeSpacing;
        this.modernV2Enabled = previousSettings.modernV2Enabled;
      } catch {
        // Bad settings.
      }
    }

    this.#themeSvc.settingsChange.subscribe((settingsChange) => {
      const settings = settingsChange.currentSettings;

      if (settings.theme === SkyTheme.presets.default) {
        this.themeName = 'default';
        this.themeMode = 'light';
        this.themeSpacing = 'standard';
      } else {
        this.themeName = settings.theme.name as ThemeSelectorValue;
        this.themeMode = settings.mode.name as ThemeSelectorModeValue;
        this.themeSpacing = settings.spacing.name as ThemeSelectorSpacingValue;
      }

      this.#currentThemeSettings = settings;
      this.#updateModeAndSpacingOptions();
    });
  }

  #updateModeAndSpacingOptions(): void {
    if (this.#currentThemeSettings) {
      this.spacingValues =
        this.#currentThemeSettings.theme.supportedSpacing.map(
          (spacing) => spacing.name as ThemeSelectorSpacingValue,
        );

      this.modeValues = this.#currentThemeSettings.theme.supportedModes.map(
        (mode) => mode.name as ThemeSelectorModeValue,
      );
    }
  }

  #updateThemeSettings(): void {
    const themeSpacing = SkyThemeSpacing.presets[this.themeSpacing];
    const themeMode = SkyThemeMode.presets[this.themeMode];

    let theme: SkyTheme;

    if (this.themeName === 'modern') {
      theme = SkyTheme.presets.modern;
    } else {
      theme = SkyTheme.presets.default;
    }

    this.#themeSvc.setTheme(
      new SkyThemeSettings(theme, themeMode, themeSpacing),
    );

    this.#saveSettings({
      themeName: this.themeName,
      themeMode: this.themeMode,
      themeSpacing: this.themeSpacing,
      modernV2Enabled: this.modernV2Enabled,
    });
  }

  #toggleModernV2Class(addClass: boolean): void {
    if (addClass) {
      this.#renderer.addClass(document.body, 'sky-theme-brand-blackbaud');
    } else {
      this.#renderer.removeClass(document.body, 'sky-theme-brand-blackbaud');
    }
  }

  #getLastSettings(): LocalStorageSettings | undefined {
    try {
      return JSON.parse(localStorage.getItem(PREVIOUS_SETTINGS_KEY));
    } catch {
      // Local storage is disabled or settings are invalid.
      return undefined;
    }
  }

  #saveSettings(settings: LocalStorageSettings): void {
    try {
      localStorage.setItem(PREVIOUS_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Local storage is disabled.
    }
  }
}
