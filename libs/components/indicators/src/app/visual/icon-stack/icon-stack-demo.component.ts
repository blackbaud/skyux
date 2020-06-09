import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'sky-icon-stack-demo',
  templateUrl: './icon-stack-demo.component.html'
})
export class SkyIconStackDemoComponent {

  constructor(private themeSvc: SkyThemeService) { }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
