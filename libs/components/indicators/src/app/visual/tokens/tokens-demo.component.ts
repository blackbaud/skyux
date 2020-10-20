import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyToken
} from '../../public/modules/tokens/types/token';

@Component({
  selector: 'sky-tokens-demo',
  templateUrl: './tokens-demo.component.html'
})
export class SkyTokensDemoComponent {
  public colors: SkyToken[] = [
    { id: 1, name: 'Black' },
    { id: 2, name: 'Blue' },
    { id: 3, name: 'Brown' },
    { id: 4, name: 'Green' },
    { id: 5, name: 'Orange' },
    { id: 6, name: 'Pink' },
    { id: 7, name: 'Purple' },
    { id: 8, name: 'Red' },
    { id: 9, name: 'Turquoise' },
    { id: 10, name: 'White' },
    { id: 11, name: 'Yellow' }
  ].map(value => ({ value }));

  public filters: SkyToken[] = [
    { id: 1, label: 'Canada' },
    { id: 2, label: 'Older than 55' },
    { id: 3, label: 'Employed' },
    { id: 4, label: 'Added before 2018' }
  ].map(value => ({ value }));

  constructor(private themeSvc: SkyThemeService) { }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
