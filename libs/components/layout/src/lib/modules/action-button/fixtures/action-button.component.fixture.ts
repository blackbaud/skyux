import { Component, ViewChild } from '@angular/core';

import { SkyActionButtonContainerComponent } from '../action-button-container.component';
import { SkyActionButtonPermalink } from '../action-button-permalink';
import { SkyActionButtonContainerAlignItemsType } from '../types/action-button-container-align-items-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './action-button.component.fixture.html',
  standalone: false,
})
export class ActionButtonTestComponent {
  public firstButtonHeight: string | undefined;

  public permalink1: SkyActionButtonPermalink = {
    url: 'https://developer.blackbaud.com/skyux/components',
  };

  public permalink2: SkyActionButtonPermalink = {
    route: {
      commands: [],
      extras: {
        fragment: 'fragment',
        queryParams: {
          page: 1,
        },
        queryParamsHandling: 'merge',
      },
    },
  };

  public bbNavLink1: SkyActionButtonPermalink = {
    url: '1bb-nav://yep/',
  };

  public bbNavLink2: SkyActionButtonPermalink = {
    url: '1bb-nav://nope/',
  };

  public buttonIsClicked = false;

  public alignItems: SkyActionButtonContainerAlignItemsType | undefined;

  @ViewChild(SkyActionButtonContainerComponent, {
    read: SkyActionButtonContainerComponent,
    static: true,
  })
  public actionButtonContainer: SkyActionButtonContainerComponent | undefined;

  public buttonClicked() {
    this.buttonIsClicked = true;
  }
}
