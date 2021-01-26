import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'toolbar-visual',
  templateUrl: './toolbar-visual.component.html'
})
export class ToolbarVisualComponent {

  public theme: string;

  constructor(private themeSvc: SkyThemeService) { }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);

    this.theme = themeSettings.theme.name;
  }

}
