import {
  Component,
  Optional
} from '@angular/core';
import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'demo-control-panel-theme-visual',
  templateUrl: './demo-control-panel-theme-visual.component.html'
})
export class DemoControlPanelThemeVisualComponent {

  constructor(
    @Optional() private themeSvc?: SkyThemeService
  ) { }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    if (this.themeSvc) {
      this.themeSvc.setTheme(themeSettings);
    }
  }
}
