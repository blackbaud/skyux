import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-inline-help',
  templateUrl: './inline-help.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineHelpComponent {
  public onHelpClick(): void {
    console.log(`Help was clicked.`);
  }
}
