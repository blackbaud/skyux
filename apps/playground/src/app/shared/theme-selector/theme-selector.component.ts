import { Component, OnInit } from '@angular/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { ThemeSelectorValue } from './theme-selector-value';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sky-theme-selector',
  templateUrl: './theme-selector.component.html',
})
export class SkyThemeSelectorComponent implements OnInit {
  public set themeName(value: ThemeSelectorValue | undefined) {
    const previousThemeName = this._themeName;
    this._themeName = value;

    if (value !== previousThemeName) {
      this.updateThemeSettings();
    }
  }

  public get themeName(): ThemeSelectorValue | undefined {
    return this._themeName;
  }

  private _themeName: ThemeSelectorValue | undefined;

  constructor(private themeSvc: SkyThemeService) {}

  public ngOnInit() {
    this.themeSvc.settingsChange.subscribe((settingsChange) => {
      const settings = settingsChange.currentSettings;

      if (settings.theme === SkyTheme.presets.modern) {
        this.themeName =
          settings.mode === SkyThemeMode.presets.dark
            ? 'modern-dark'
            : 'modern-light';
      } else {
        this.themeName = 'default';
      }
    });
  }

  private updateThemeSettings() {
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

    this.themeSvc.setTheme(new SkyThemeSettings(theme, themeMode));
  }
}
