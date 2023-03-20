import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import {
  SkyActionHubNeedsAttention,
  SkyPageLink,
  SkyPageModalLink,
} from '@skyux/pages';

import { SettingsModalComponent } from './modal/settings-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  public relatedLinks: SkyPageLink[] = [];
  public settingsLinks: SkyPageModalLink[] = [];
  public needsAttention: SkyActionHubNeedsAttention[];
  public showButtons = false;

  constructor(private modalService: SkyModalService) {
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
    this.needsAttention = [
      {
        title: 'Route to the home page',
        permalink: {
          route: {
            commands: ['/'],
          },
        },
      },
      {
        title: 'Recently accessed',
        permalink: {
          route: {
            commands: ['../recent'],
          },
        },
      },
      {
        title: 'External link',
        permalink: {
          url: 'https://www.google.com',
        },
      },
      {
        title: 'Sky UX',
        permalink: {
          url: 'https://developer.blackbaud.com/skyux/',
        },
      },
      {
        title: 'Hash link',
        permalink: {
          url: '#',
        },
      },
      {
        title: 'Click to open a modal',
        click: () => {
          this.modalService.open(SettingsModalComponent, {
            providers: [
              { provide: 'modalTitle', useValue: 'Click event modal' },
            ],
          });
        },
      },
      {
        title: 'Click to show alert',
        click: () => {
          alert('Click event alert');
        },
      },
    ];
  }
}
