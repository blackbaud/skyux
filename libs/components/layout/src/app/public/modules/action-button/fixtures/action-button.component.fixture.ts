import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyActionButtonContainerComponent
} from '../action-button-container.component';

import {
  SkyActionButtonPermalink
} from '../action-button-permalink';

import {
  SkyActionButtonContainerAlignItems
} from '../types/action-button-container-align-items';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './action-button.component.fixture.html'
})
export class ActionButtonTestComponent {

  public firstButtonHeight: string;

  public permalink1: SkyActionButtonPermalink = {
    url: 'https://developer.blackbaud.com/skyux/components'
  };

  public permalink2: SkyActionButtonPermalink = {
    route: {
      commands: [],
      extras: {
        fragment: 'fragment',
        queryParams: {
          page: 1
        },
        queryParamsHandling: 'merge'
      }
    }
  };

  public buttonIsClicked: boolean = false;

  public alignItems: SkyActionButtonContainerAlignItems;

  @ViewChild(SkyActionButtonContainerComponent, {
    read: SkyActionButtonContainerComponent,
    static: true
  })
  public actionButtonContainer: SkyActionButtonContainerComponent;

  public buttonClicked() {
    this.buttonIsClicked = true;
  }
}
