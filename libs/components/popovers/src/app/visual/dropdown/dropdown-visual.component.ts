import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyDropdownMenuChange
} from '../../public/public_api';

@Component({
  selector: 'dropdown-visual',
  templateUrl: './dropdown-visual.component.html'
})
export class DropdownVisualComponent {

  public colors: any[] = [
    { name: 'Red' },
    { name: 'Blue' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Yellow' },
    { name: 'Brown' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Black' },
    { name: 'Teal' },
    { name: 'Chartrouse' },
    { name: 'Salmon' },
    { name: 'Beige' },
    { name: 'Walnut' },
    { name: 'Perrywinkle' },
    { name: 'Fire truck red' },
    { name: 'Grey' },
    { name: 'Aqua' },
    { name: 'Cream' },
    { name: 'Violet' },
    { name: 'Hunter green' }
  ];

  constructor(private themeSvc: SkyThemeService) { }

  public onItemClick(): void {
    console.log('Item clicked!');
  }

  public onMenuChanges(change: SkyDropdownMenuChange): void {
    console.log('Menu change:', change);
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
