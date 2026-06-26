import { Component, input, signal } from '@angular/core';
import { SkyTheme, SkyThemeMode, SkyThemeSettings } from '@skyux/theme';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './filter-button.component.fixture.html',
  standalone: false,
})
export class FilterButtonTestComponent {
  public filtersActive = input<boolean>(false);
  public showButtonText = input<boolean>(false);
  public buttonId = input<string | undefined>(undefined);
  public ariaExpanded = input<boolean | undefined>(undefined);
  public ariaControls = input<string | undefined>(undefined);
  public ariaLabel = input<string | undefined>(undefined);
  public skyThemeSettings = signal<SkyThemeSettings>(
    new SkyThemeSettings(SkyTheme.presets.default, SkyThemeMode.presets.light),
  );

  public buttonClicked = false;

  public useDefaultTheme(): void {
    this.skyThemeSettings.set(
      new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      ),
    );
  }

  public useModernTheme(): void {
    this.skyThemeSettings.set(
      new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
      ),
    );
  }

  public filterButtonClicked(): void {
    this.buttonClicked = true;
  }
}
