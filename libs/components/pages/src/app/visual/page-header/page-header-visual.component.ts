import { Component } from '@angular/core';
import { SkyThemeService, SkyThemeSettings } from '@skyux/theme';

@Component({
  selector: 'sky-page-header-visual',
  templateUrl: './page-header-visual.component.html'
})
export class PageHeaderVisualComponent {
  public pageTitle = 'Page Title';
  public parentLink = {
    label: 'Parent Link',
    permalink: {
      url: '#'
    }
  };
  public spokeTitleLong =
    'Page Title has extra words that some might think go too far';
  public hubLinkLong = {
    label: 'Parent Link with a Title that has More Words than you might expect',
    permalink: {
      url: '#'
    }
  };

  constructor(private themeSvc: SkyThemeService) {}

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
