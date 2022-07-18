import { Component } from '@angular/core';
import { SkyPageLink, SkyPageModalLink } from '@skyux/pages';

import { SettingsModalComponent } from './modal/settings-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  public relatedLinks: SkyPageLink[] = [];
  public settingsLinks: SkyPageModalLink[] = [];

  constructor() {
    ['Back', 'Home'].forEach((label) => {
      this.relatedLinks.push({
        label,
        permalink: {
          route: {
            commands: ['/'],
          },
        },
      });
    });
    [
      'Automatic applications',
      'Custom fields',
      'Email defaults',
      'Grade levels',
      'Payments',
      'Support contact',
      'Table entries',
    ].forEach((label) => {
      this.settingsLinks.push({
        label,
        modal: {
          component: SettingsModalComponent,
          config: {
            providers: [{ provide: 'modalTitle', useValue: label }],
          },
        },
      });
    });
  }
}
