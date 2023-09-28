import { Component } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styles: [
    `
      :host {
        display: block;
        margin: 20px;
      }
    `,
  ],
})
export class BoxComponent {
  public showHelp = true;

  public onHelpClick() {
    alert(`Help is available for this component.`);
  }
}
