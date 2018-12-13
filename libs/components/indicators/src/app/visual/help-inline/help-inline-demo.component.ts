import { Component } from '@angular/core';

@Component({
  selector: 'sky-help-inline-demo',
  templateUrl: './help-inline-demo.component.html'
})
export class SkyHelpInlineDemoComponent {
  public buttonIsClicked = false;

  public onActionClick(): void {
    this.buttonIsClicked = true;
  }
}
