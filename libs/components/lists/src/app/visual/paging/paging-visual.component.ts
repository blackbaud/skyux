import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'paging-visual',
  templateUrl: './paging-visual.component.html'
})
export class PagingVisualComponent {

  constructor(private themeSvc: SkyThemeService) { }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
