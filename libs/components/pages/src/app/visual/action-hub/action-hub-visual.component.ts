import { Component } from '@angular/core';
import { SkyActionHubNeedsAttention } from '@skyux/pages';
import { SkyThemeService, SkyThemeSettings } from '@skyux/theme';

@Component({
  selector: 'app-action-hub-visual',
  templateUrl: './action-hub-visual.component.html'
})
export class ActionHubVisualComponent {
  public title = 'Action Hub';
  public needsAttention: SkyActionHubNeedsAttention[] | 'loading' = [
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
  ];
  public recentLinks = [
    {
      label: 'Recent 1',
      permalink: {
        url: '#'
      },
      lastAccessed: new Date(2021, 6, 14, 11, 45)
    },
    {
      label: 'Recent 2',
      permalink: {
        url: '#'
      },
      lastAccessed: new Date(2021, 6, 14, 11, 44)
    },
    {
      label: 'Recent 3',
      permalink: {
        url: '#'
      },
      lastAccessed: new Date(2021, 6, 14, 11, 43)
    },
    {
      label: 'Recent 4',
      permalink: {
        url: '#'
      },
      lastAccessed: new Date(2021, 6, 14, 11, 42)
    },
    {
      label: 'Recent 5',
      permalink: {
        url: '#'
      },
      lastAccessed: new Date(2021, 6, 14, 11, 41)
    }
  ];
  public relatedLinks = [
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
  ];
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
