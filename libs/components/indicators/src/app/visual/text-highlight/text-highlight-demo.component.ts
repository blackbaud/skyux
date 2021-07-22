import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'sky-text-highlight-demo',
  templateUrl: './text-highlight-demo.component.html'
})
export class SkyTextHighlightDemoComponent {
  public normalSearchTerm = 'enter';
  public blankSearchTerm = '';
  public notMatchedSearchTerm = 'xnotmatched';

  public themeSettings: SkyThemeSettings;

  constructor(private themeSvc: SkyThemeService) { }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
