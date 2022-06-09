import { Component } from '@angular/core';
import {
  SkyActionButtonContainerAlignItemsType,
  SkyActionButtonPermalink,
} from '@skyux/layout';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
})
export class ActionButtonComponent {
  public alignItems: SkyActionButtonContainerAlignItemsType;

  public actionButtons = [
    {
      iconType: 'square-o',
      header: 'Action button',
      details:
        'The action button module creates a large button with an icon, heading, and details.',
    },
    {
      iconType: 'bell',
      header: 'Alert',
      details:
        'The alert component highlights critical information that users must see.',
    },
    {
      iconType: 'search',
      header: 'Autocomplete',
      details:
        'The autocomplete component creates a text input that filters data based on user entries.',
      permalink: {
        route: {
          commands: ['search'],
          extras: {
            fragment: 'search',
          },
        },
      },
    },
    {
      iconType: 'calculator',
      header: 'Autonumeric',
      details:
        'The autonumeric module formats currency and other numbers that users enter in form inputs.',
    },
    {
      iconType: 'user',
      header: 'Avatar',
      details:
        'The avatar component displays an image to identify a record and allows users to change the image.',
    },
    {
      iconType: 'arrow-up',
      header: 'Back to top',
      details:
        'The back to top directive creates a button for users to easily access the top of long lists.',
    },
    {
      iconType: 'square-o',
      header: 'Button',
      details:
        'The button classes create buttons to trigger actions from within an interface.',
    },
    {
      iconType: 'arrow-up',
      header: 'Height',
      details:
        "If you're looking at me in modern theme, this action button should set the height for the rest of the buttons because it has the most content. I made sure the text is extra long so its obvious!",
    },
    {
      iconType: 'eye-slash',
      header: 'Not visible',
      details: 'This link should not be visible.',
      permalink: {
        url: '1bb-nav://nope/',
      },
    },
  ];

  public buttonIsClicked = false;

  public permalink = {
    url: 'https://developer.blackbaud.com/skyux/components',
  };

  public routerlink: SkyActionButtonPermalink = {
    route: {
      commands: [],
      extras: {
        queryParams: {
          component: 'MyComponent',
        },
      },
    },
  };

  public buttonClicked(): void {
    this.buttonIsClicked = true;
  }

  public changeContentClick(): void {
    const variations = [
      "If you're looking at me in modern theme, this action button should set the height for the rest of the buttons because it has the most content. I made sure the text is extra long so its obvious!",
      'This shorter string should make all buttons shrink in height.',
    ];
    this.actionButtons[7].details =
      this.actionButtons[7].details === variations[0]
        ? variations[1]
        : variations[0];
  }

  public onCenterAlignClick(): void {
    this.alignItems = 'center';
  }

  public onLeftAlignClick(): void {
    this.alignItems = 'left';
  }
}
