import { Component, Input } from '@angular/core';

import { SkyThemeSettings } from '../theme-settings';

@Component({
  selector: 'app-theme-test',
  templateUrl: './theme-test.component.html',
})
export class SkyThemeTestComponent {
  @Input()
  public themeSettings: SkyThemeSettings | undefined;
}
