import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'avatar-visual',
  templateUrl: './avatar-visual.component.html'
})
export class AvatarVisualComponent {

  public name = 'Robert C. Hernandez';

  public themeSettings: SkyThemeSettings;

  constructor(private themeSvc: SkyThemeService) { }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
