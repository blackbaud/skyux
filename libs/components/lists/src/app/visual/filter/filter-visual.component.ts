import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'filter-visual',
  templateUrl: './filter-visual.component.html'
})
export class FilterVisualComponent {
  public filtersActive: boolean = false;

  public appliedFilters: Array<any> = [
    {
      label: 'hide orange',
      dismissible: false
    },
    {
      label: 'berry fruit type',
      dismissible: true
    }
  ];

  public lotsOfFilters: Array<any> = [
    {
      label: 'Really long filter 1',
      dismissible: false
    },
    {
      label: 'Really long filter 2',
      dismissible: true
    },
    {
      label: 'Really long filter 3',
      dismissible: true
    },
    {
      label: 'Really long filter 4',
      dismissible: true
    },
    {
      label: 'Really long filter 5',
      dismissible: true
    },
    {
      label: 'Really long filter 6',
      dismissible: true
    },
    {
      label: 'Really long filter 7',
      dismissible: true
    },
    {
      label: 'Really long filter 8',
      dismissible: true
    },
    {
      label: 'Really long filter 9',
      dismissible: true
    }
  ];

  constructor(
    public themeSvc: SkyThemeService
  ) {
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
