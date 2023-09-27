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

  public boxHeader = 'Initial box header';

  public onHelpClick() {
    alert(`Help is available for this component.`);
  }

  public changeHeader(): void {
    this.boxHeader = 'A new box header';
  }
}
