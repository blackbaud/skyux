import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'sky-status-indicator-visual',
  templateUrl: './status-indicator-visual.component.html'
})
export class StatusIndicatorVisualComponent {
  public themeSettings: SkyThemeSettings;

  constructor(private themeSvc: SkyThemeService) { }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
