import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'sky-help-inline-demo',
  templateUrl: './help-inline-demo.component.html'
})
export class SkyHelpInlineDemoComponent {

  public buttonIsClicked = false;

  constructor(
    private themeSvc: SkyThemeService
  ) { }

  public onActionClick(): void {
    this.buttonIsClicked = true;
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
