import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'sky-buttons-demo',
  templateUrl: './buttons-demo.component.html',
  styleUrls: ['./buttons-demo.component.scss']
})
export class SkyButtonsDemoComponent {

  constructor(private themeSvc: SkyThemeService) { }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
