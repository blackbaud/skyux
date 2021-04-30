import { Component } from '@angular/core';

import { SkyActionHubData } from '../../public/modules/action-hub/types/action-hub-data';

@Component({
  selector: 'app-action-hub-docs',
  styleUrls: ['action-hub-docs.component.scss'],
  templateUrl: 'action-hub-docs.component.html'
})
export class ActionHubDocsComponent {
  public data: SkyActionHubData = {
    title: 'Action Hub',
    needsAttention: [
      {
        title: '1 update',
        message: 'from portal',
        permalink: {
          url: '#'
        }
      },
      {
        title: '2 new messages',
        message: 'from online donation',
        permalink: {
          url: '#'
        }
      },
      {
        title: '3 possible duplicates',
        message: 'from constituent lists',
        permalink: {
          url: '#'
        }
      }
    ],
    recentLinks: [
      {
        label: 'Recent 1',
        permalink: {
          url: '#'
        }
      },
      {
        label: 'Recent 2',
        permalink: {
          url: '#'
        }
      },
      {
        label: 'Recent 3',
        permalink: {
          url: '#'
        }
      }
    ],
    relatedLinks: [
      {
        label: 'Related 1',
        permalink: {
          url: '#'
        }
      },
      {
        label: 'Related 2',
        permalink: {
          url: '#'
        }
      },
      {
        label: 'Related 3',
        permalink: {
          url: '#'
        }
      }
    ]
  };

  public buttonClick($event: MouseEvent) {
    alert('You did it!');
  }
}
