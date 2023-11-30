import { Component } from '@angular/core';

import { SkyTheme } from '../theme';
import { SkyThemeMode } from '../theme-mode';
import { SkyThemeSettings } from '../theme-settings';

@Component({
  selector: 'app-theme-class-test',
  templateUrl: './theme-class-test.component.html',
})
export class SkyThemeClassTestComponent {
  public className: string | undefined = 'sky-theme-class-test';
  public themeSettings: SkyThemeSettings | undefined;

  constructor() {
    this.useDefaultTheme();
  }

  public useDefaultTheme(): void {
    this.themeSettings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light
    );
  }

  public useModernTheme(): void {
    this.themeSettings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.light
    );
  }
}
