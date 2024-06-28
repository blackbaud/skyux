import { Component } from '@angular/core';

import { SkyTheme } from '../theme';
import { SkyThemeMode } from '../theme-mode';
import { SkyThemeSettings } from '../theme-settings';
import { SkyThemeComponentClassDirective } from '../theme-component-class.directive';

@Component({
  selector: 'app-theme-component-class-test',
  templateUrl: './theme-component-class-test.component.html',
  standalone: true,
  hostDirectives: [SkyThemeComponentClassDirective]
})
export class SkyThemeComponentClassTestComponent {
  public themeSettings: SkyThemeSettings | undefined;

  constructor() {
    this.useDefaultTheme();
  }

  public useDefaultTheme(): void {
    this.themeSettings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light,
    );
  }

  public useModernTheme(): void {
    this.themeSettings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.light,
    );
  }
}
