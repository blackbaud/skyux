import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

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
  imports: [SkyHelpInlineModule],
})
export class InlineHelpComponent {
  public onHelpClick(): void {
    console.log(`Help was clicked.`);
  }
}
