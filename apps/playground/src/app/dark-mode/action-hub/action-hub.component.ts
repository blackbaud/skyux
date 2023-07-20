import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { SkyActionHubModule, SkyPageModule } from '@skyux/pages';

import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-action-hub-visual',
  templateUrl: './action-hub.component.html',
  standalone: true,
  imports: [CommonModule, SkyActionHubModule, SkyPageModule],
})
export default class ActionHubDemoComponent {
  #modalSvc = inject(SkyModalService);

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
      title: '1 overdue progress report',
      click: () => this.#modalSvc.open(ModalComponent, { size: 'large' }),
    },
    {
      title: '8 new message from online donation',
      permalink: {
        url: '#',
      },
    },
    {
      title: '7 possible duplicates from constituent lists',
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
}
