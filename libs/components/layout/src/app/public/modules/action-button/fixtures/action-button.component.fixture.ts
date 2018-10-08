import { Component } from '@angular/core';
import { SkyActionButtonPermalink } from '../types';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './action-button.component.fixture.html'
})
export class ActionButtonTestComponent {

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

  public buttonClicked() {
    this.buttonIsClicked = true;
  }
}
