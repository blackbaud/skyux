import { Component } from '@angular/core';

@Component({
  selector: 'app-help-inline',
  templateUrl: './help-inline.component.html',
})
export class HelpInlineComponent {
  public buttonIsClicked = false;

  public onActionClick(): void {
    this.buttonIsClicked = true;
  }
}
