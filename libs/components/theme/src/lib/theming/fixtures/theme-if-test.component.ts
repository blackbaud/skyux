import { Component, input, signal } from '@angular/core';

import { SkyTheme } from '../theme';
import { SkyThemeMode } from '../theme-mode';
import { SkyThemeSettings } from '../theme-settings';

@Component({
  selector: 'app-theme-if-test',
  templateUrl: './theme-if-test.component.html',
  standalone: false,
})
export class SkyThemeIfTestComponent {
  public themeSettings = signal<SkyThemeSettings | undefined>(undefined);
  public testThemeName = input<'default' | 'modern'>('default');

  constructor() {
    this.useDefaultTheme();
  }

  public useDefaultTheme(): void {
    this.themeSettings.set(
      new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      ),
    );
  }

  public useModernTheme(): void {
    this.themeSettings.set(
      new SkyThemeSettings(SkyTheme.presets.modern, SkyThemeMode.presets.light),
    );
  }
}
