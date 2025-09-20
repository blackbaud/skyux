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
  standalone: false,
})
export class BoxComponent {
  public showControls = true;
  public showHeader = true;
  public showHelp = true;
  public headingStyle: number | undefined;

  public onHelpClick(): void {
    alert(`Help is available for this component.`);
  }

  public toggleHeadingStyle(): void {
    const newStyle = (this.headingStyle ?? 1) + 1;
    if (newStyle > 5) {
      this.headingStyle = undefined;
    } else {
      this.headingStyle = newStyle;
    }
  }
}
