import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyActionHubModule, SkyPageModalLinksInput } from '@skyux/pages';

import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-action-hub-visual',
  templateUrl: './action-hub.component.html',
  standalone: true,
  imports: [CommonModule, SkyActionHubModule],
})
export default class ActionHubDemoComponent {
  public buttons = [
    {
      label: 'Action 1',
      permalink: {
        url: '#',
      },
    },
    {
      label: 'Action 2',
      permalink: {
        url: '#',
      },
    },
    {
      label: 'Action 3',
      permalink: {
        url: '#',
      },
    },
  ];

  public needsAttention = [
    {
      title: '9',
      message: 'updates from portal',
      permalink: {
        url: '#',
      },
    },
    {
      title: '8',
      message: 'new messages from online donation',
      permalink: {
        url: '#',
      },
    },
    {
      title: '7',
      message: 'possible duplicates from constituent lists',
      permalink: {
        url: '#',
      },
    },
  ];

  public relatedLinks = [
    {
      label: 'Contacts',
      permalink: {
        url: '/#/dark-mode/contacts',
      },
    },
    {
      label: 'Link 2',
      permalink: {
        url: '#',
      },
    },
    {
      label: 'Link 3',
      permalink: {
        url: '#',
      },
    },
  ];

  public settingsLinks: SkyPageModalLinksInput = [
    {
      label: 'Number',
      modal: {
        component: ModalComponent,
        config: {
          size: 'large',
          providers: [
            {
              provide: 'modalTitle',
              useValue: 'Number',
            },
          ],
        },
      },
    },
    {
      label: 'Color',
      modal: {
        component: ModalComponent,
        config: {
          size: 'large',
          providers: [
            {
              provide: 'modalTitle',
              useValue: 'Color',
            },
          ],
        },
      },
    },
  ];

  public title = 'Page title';
}
