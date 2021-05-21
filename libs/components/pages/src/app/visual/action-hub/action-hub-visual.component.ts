import { Component } from '@angular/core';
import { SkyThemeService, SkyThemeSettings } from '@skyux/theme';

@Component({
  selector: 'app-action-hub-visual',
  templateUrl: './action-hub-visual.component.html'
})
export class ActionHubVisualComponent {
  public data = {
    title: 'Action Hub',
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
      },
      {
        title: '4',
        message: 'updates from portal',
        permalink: {
          url: '#'
        }
      },
      {
        title: '5',
        message: 'new messages from online donation',
        permalink: {
          url: '#'
        }
      },
      {
        title: '6',
        message: 'possible duplicates from constituent lists',
        permalink: {
          url: '#'
        }
      },
      {
        title: '7',
        message: 'update from portal',
        permalink: {
          url: '#'
        }
      },
      {
        title: '8',
        message: 'new messages from online donation',
        permalink: {
          url: '#'
        }
      },
      {
        title: '9',
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
      },
      {
        label: 'Recent 4',
        permalink: {
          url: '#'
        }
      },
      {
        label: 'Recent 5',
        permalink: {
          url: '#'
        }
      }
    ],
    relatedLinks: [
      {
        label: 'Link 1',
        permalink: {
          url: '#'
        }
      },
      {
        label: 'Link 2',
        permalink: {
          url: '#'
        }
      },
      {
        label: 'Link 3',
        permalink: {
          url: '#'
        }
      }
    ]
  };
  public buttons = [
    {
      label: 'Action 1',
      permalink: {
        url: '#'
      }
    },
    {
      label: 'Action 2',
      permalink: {
        url: '#'
      }
    },
    {
      label: 'Action 3',
      permalink: {
        url: '#'
      }
    }
  ];

  constructor(private themeSvc: SkyThemeService) {}

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
