import { Component } from '@angular/core';
import { SkyTheme, SkyThemeMode, SkyThemeSettings } from '@skyux/theme';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './filter-button.component.fixture.html',
})
export class FilterButtonTestComponent {
  public filtersActive = false;
  public showButtonText = false;
  public buttonClicked = false;
  public buttonId: string;
  public ariaExpanded: boolean;
  public ariaControls: string;
  public skyThemeSettings: SkyThemeSettings;

  constructor() {
    this.useDefaultTheme();
  }

  public useDefaultTheme(): void {
    this.skyThemeSettings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light
    );
  }

  public useModernTheme(): void {
    this.skyThemeSettings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.light
    );
  }

  public filterButtonClicked() {
    this.buttonClicked = true;
  }
}
