import { Component, input, signal } from '@angular/core';

import { SkyTheme } from '../theme';
import { SkyThemeMode } from '../theme-mode';
import { SkyThemeSettings } from '../theme-settings';

@Component({
  selector: 'app-theme-class-test',
  templateUrl: './theme-class-test.component.html',
  standalone: false,
})
export class SkyThemeClassTestComponent {
  public className = input<string | undefined>('sky-theme-class-test');
  public themeSettings = signal<SkyThemeSettings | undefined>(undefined);

  constructor() {
    this.useDefaultTheme();
  }

  public useDefaultTheme(): void {
    this.themeSettings.set(
      new SkyThemeSettings(SkyTheme.presets.default, SkyThemeMode.presets.light),
    );
  }

  public useModernTheme(): void {
    this.themeSettings.set(
      new SkyThemeSettings(SkyTheme.presets.modern, SkyThemeMode.presets.light),
    );
  }
}
