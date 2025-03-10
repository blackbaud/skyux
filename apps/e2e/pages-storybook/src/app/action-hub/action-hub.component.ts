import { Component } from '@angular/core';
import {
  SkyActionHubNeedsAttention,
  SkyPageLink,
  SkyPageModalLinksInput,
  SkyRecentLink,
} from '@skyux/pages';

import { SettingsModalComponent } from './settings-modal.component';

const pastHours = Array.from(Array(5).keys()).map((i) => {
  const date = new Date();
  date.setHours(date.getHours() - (i + 1));
  return date;
});

@Component({
  selector: 'app-action-hub',
  templateUrl: './action-hub.component.html',
  styleUrls: ['./action-hub.component.scss'],
  standalone: false,
})
export class ActionHubComponent {
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

  public needsAttention: SkyActionHubNeedsAttention[] = [
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

  public recentLinks: SkyRecentLink[] = [
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

  public relatedLinks: SkyPageLink[] = [
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
        component: SettingsModalComponent,
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
