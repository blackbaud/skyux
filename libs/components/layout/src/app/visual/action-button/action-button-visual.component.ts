import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyActionButtonContainerAlignItems,
  SkyActionButtonPermalink
} from '../../public/public_api';

@Component({
  selector: 'action-button-visual',
  templateUrl: './action-button-visual.component.html'
})
export class ActionButtonVisualComponent {

  public alignItems: SkyActionButtonContainerAlignItems;

  public actionButtons: any[] = [
    {
      iconType: 'square-o',
      header: 'Action button',
      details: 'The action button module creates a large button with an icon, heading, and details.'
    },
    {
      iconType: 'bell',
      header: 'Alert',
      details: 'The alert component highlights critical information that users must see.'
    },
    {
      iconType: 'search',
      header: 'Autocomplete',
      details: 'The autocomplete component creates a text input that filters data based on user entries.'
    },
    {
      iconType: 'calculator',
      header: 'Autonumeric',
      details: 'The autonumeric module formats currency and other numbers that users enter in form inputs.'
    },
    {
      iconType: 'user',
      header: 'Avatar',
      details: 'The avatar component displays an image to identify a record and allows users to change the image.'
    },
    {
      iconType: 'arrow-up',
      header: 'Back to top',
      details: 'The back to top directive creates a button for users to easily access the top of long lists.'
    },
    {
      iconType: 'square-o',
      header: 'Button',
      details: 'The button classes create buttons to trigger actions from within an interface.'
    },
    {
      iconType: 'arrow-up',
      header: 'Height',
      details: 'If you\'re looking at me in modern theme, this action button should set the height for the rest of the buttons because it has the most content. I made sure the text is extra long so its obvious!'
    }
  ];

  public buttonIsClicked: boolean = false;

  public permalink = {
    url: 'https://developer.blackbaud.com/skyux/components'
  };

  public routerlink: SkyActionButtonPermalink = {
    route: {
      commands: [],
      extras: {
        queryParams: {
          component: 'MyComponent'
        }
      }
    }
  };

  constructor(
    private themeSvc: SkyThemeService
  ) { }

  public buttonClicked(): void {
    this.buttonIsClicked = true;
  }

  public changeContentClick(): void {
    this.actionButtons[7].details = 'This shorter string should make all buttons shrink in height.';
  }

  public onCenterAlignClick(): void {
    this.alignItems = SkyActionButtonContainerAlignItems.Center;
  }

  public onLeftAlignClick(): void {
    this.alignItems = SkyActionButtonContainerAlignItems.Left;
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
