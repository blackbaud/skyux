import { Component } from '@angular/core';
import { SkyTheme, SkyThemeMode, SkyThemeSettings } from '@skyux/theme';

@Component({
  selector: 'app-input-box-demo',
  templateUrl: './input-box-demo.component.html',
})
export class InputBoxDemoComponent {
  /**
   * The input box component is designed for the modern theme.
   * This is purely for demonstration purposes.
   */
  public modernLightTheme = new SkyThemeSettings(
    SkyTheme.presets.modern,
    SkyThemeMode.presets.light
  );
}
