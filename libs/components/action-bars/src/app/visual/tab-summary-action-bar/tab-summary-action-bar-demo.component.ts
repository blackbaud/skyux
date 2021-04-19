import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'sky-tab-summary-action-bar-demo',
  templateUrl: './tab-summary-action-bar-demo.component.html',
  styleUrls: ['./tab-summary-action-bar-demo.component.scss']
})
export class SkyTabSummaryActionBarDemoComponent {

  constructor(
    private themeSvc: SkyThemeService
  ) { }

  public printHello() {
    console.log('hello');
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
