import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSpacing,
} from '@skyux/theme';

import { ThemeSelectorSpacingValue } from './theme-selector-spacing-value';
import { ThemeSelectorValue } from './theme-selector-value';

interface LocalStorageSettings {
  themeName: ThemeSelectorValue;
  themeSpacing: ThemeSelectorSpacingValue;
}

const PREVIOUS_SETTINGS_KEY = 'skyux-playground-theme-selector-settings';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sky-theme-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, SkyIdModule, SkyInputBoxModule],
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

  protected spacingValues: ThemeSelectorSpacingValue[] = [];

  #_themeName: ThemeSelectorValue | undefined;
  #_themeSpacing: ThemeSelectorSpacingValue | undefined;

  #themeSvc = inject(SkyThemeService);
  #currentThemeSettings: SkyThemeSettings | undefined;

  public ngOnInit(): void {
    const previousSettings = this.#getLastSettings();

    if (previousSettings) {
      try {
        this.themeName = previousSettings.themeName;
        this.themeSpacing = previousSettings.themeSpacing;
      } catch {
        // Bad settings.
      }
    }

    this.#themeSvc.settingsChange.subscribe((settingsChange) => {
      const settings = settingsChange.currentSettings;

      if (settings.theme === SkyTheme.presets.modern) {
        this.themeName =
          settings.mode === SkyThemeMode.presets.dark
            ? 'modern-dark'
            : 'modern-light';

        this.themeSpacing = settings.spacing.name as ThemeSelectorSpacingValue;
      } else {
        this.themeName = 'default';
        this.themeSpacing = 'standard';
      }

      this.#currentThemeSettings = settings;
      this.#updateSpacingOptions();
    });
  }

  #updateSpacingOptions(): void {
    if (this.#currentThemeSettings) {
      this.spacingValues =
        this.#currentThemeSettings.theme.supportedSpacing.map(
          (spacing) => spacing.name as ThemeSelectorSpacingValue,
        );
    }
  }

  #updateThemeSettings(): void {
    const themeSpacing =
      this.themeSpacing && SkyThemeSpacing.presets[this.themeSpacing];

    let theme: SkyTheme;
    let themeMode = SkyThemeMode.presets.light;

    switch (this.themeName) {
      case 'modern-light':
        theme = SkyTheme.presets.modern;
        break;
      case 'modern-dark':
        theme = SkyTheme.presets.modern;
        themeMode = SkyThemeMode.presets.dark;
        break;
      default:
        theme = SkyTheme.presets.default;
        break;
    }

    this.#themeSvc.setTheme(
      new SkyThemeSettings(theme, themeMode, themeSpacing),
    );

    this.#saveSettings({
      themeName: this.themeName,
      themeSpacing: this.themeSpacing,
    });
  }

  #getLastSettings(): LocalStorageSettings | undefined {
    try {
      return JSON.parse(localStorage.getItem(PREVIOUS_SETTINGS_KEY) ?? '{}');
    } catch {
      // Local storage is disabled or settings are invalid.
      return undefined;
    }
  }

  #saveSettings(settings: Partial<LocalStorageSettings>): void {
    try {
      localStorage.setItem(PREVIOUS_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Local storage is disabled.
    }
  }
}
