import { Component } from '@angular/core';
import { SkyActionHubModule, SkyPageModalLinksInput } from '@skyux/pages';

import { MODAL_TITLE } from './modal-title-token';
import { SettingsModalComponent } from './settings-modal.component';

const pastHours = Array.from(Array(5).keys()).map((i) => {
  const date = new Date();
  date.setHours(date.getHours() - (i + 1));
  return date;
});

/**
 * @title Action hub with basic setup
 * @docsDemoHidden
 */
@Component({
  selector: 'app-pages-action-hub-example',
  templateUrl: './example.component.html',
  imports: [SkyActionHubModule],
})
export class PagesActionHubExampleComponent {
  public buttons = [
    {
      label: 'Action 1',
      ariaLabel: 'Accounts action 1',
      permalink: {
        url: '#',
      },
    },
    {
      label: 'Action 2',
      ariaLabel: 'Accounts action 2',
      permalink: {
        url: '#',
      },
    },
    {
      label: 'Action 3',
      ariaLabel: 'Accounts action 3',
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
    {
      title: '6',
      message: 'updates from portal',
      permalink: {
        url: '#',
      },
    },
    {
      title: '5',
      message: 'new messages from online donation',
      permalink: {
        url: '#',
      },
    },
    {
      title: '4',
      message: 'possible duplicates from constituent lists',
      permalink: {
        url: '#',
      },
    },
    {
      title: '3',
      message: 'update from portal',
      permalink: {
        url: '#',
      },
    },
    {
      title: '2',
      message: 'new messages from online donation',
      permalink: {
        url: '#',
      },
    },
    {
      title: '1',
      message: 'possible duplicate from constituent lists',
      permalink: {
        url: '#',
      },
    },
  ];

  public recentLinks = [
    {
      label: 'Recent 1',
      permalink: {
        url: '#',
      },
      lastAccessed: pastHours[0],
    },
    {
      label: 'Recent 2',
      permalink: {
        url: '#',
      },
      lastAccessed: pastHours[1],
    },
    {
      label: 'Recent 3',
      permalink: {
        url: '#',
      },
      lastAccessed: pastHours[2],
    },
    {
      label: 'Recent 4',
      permalink: {
        url: '#',
      },
      lastAccessed: pastHours[3],
    },
    {
      label: 'Recent 5',
      permalink: {
        url: '#',
      },
      lastAccessed: pastHours[4],
    },
  ];

  public relatedLinks = [
    {
      label: 'Link 1',
      permalink: {
        url: '#',
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
        component: SettingsModalComponent,
        config: {
          size: 'large',
          providers: [
            {
              provide: MODAL_TITLE,
              useValue: 'Number',
            },
          ],
        },
      },
    },
    {
      label: 'Color',
      modal: {
        component: SettingsModalComponent,
        config: {
          size: 'large',
          providers: [
            {
              provide: MODAL_TITLE,
              useValue: 'Color',
            },
          ],
        },
      },
    },
  ];

  public title = 'Active accounts';
}
