import { Component} from '@angular/core';

@Component({
  selector: 'action-button-visual',
  templateUrl: './action-button-visual.component.html'
})
export class ActionButtonVisualComponent {

  public permalink = {
    url: 'https://developer.blackbaud.com/skyux/components'
  };

  public buttonIsClicked: boolean = false;

  public buttonClicked() {
    this.buttonIsClicked = true;
  }
}
