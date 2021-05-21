import { Component } from '@angular/core';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';

@Component({
  selector: 'app-action-hub-docs',
  styleUrls: ['action-hub-docs.component.scss'],
  templateUrl: 'action-hub-docs.component.html'
})
export class ActionHubDocsComponent {
  public data = {
    title: 'Page title',
    needsAttention: [
      {
        title: '1',
        message: 'update from portal',
        permalink: {
          url: '#'
        }
      },
      {
        title: '2',
        message: 'new messages from online donation',
        permalink: {
          url: '#'
        }
      },
      {
        title: '3',
        message: 'possible duplicates from constituent lists',
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

  constructor(private confirmService: SkyConfirmService) {}

  public buttonClick($event: MouseEvent) {
    this.confirmService.open({
      message: `You pressed “${($event.target as HTMLButtonElement).textContent.trim()}”`,
      type: SkyConfirmType.OK
    });
  }
}
