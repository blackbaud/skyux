import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'sky-key-info-visual',
  templateUrl: './key-info-visual.component.html',
  styleUrls: ['./key-info-visual.component.scss']
})
export class KeyInfoVisualComponent {

  public themeSettings: SkyThemeSettings;

  constructor(private themeSvc: SkyThemeService) { }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
