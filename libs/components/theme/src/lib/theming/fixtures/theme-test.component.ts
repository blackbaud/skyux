import { Component, input } from '@angular/core';

import { SkyThemeSettings } from '../theme-settings';

@Component({
  selector: 'app-theme-test',
  templateUrl: './theme-test.component.html',
  standalone: false,
})
export class SkyThemeTestComponent {
  public themeSettings = input<SkyThemeSettings | undefined>(undefined);
}
