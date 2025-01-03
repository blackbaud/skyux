import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyAgGridHeaderInfo } from '@skyux/ag-grid';

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
  standalone: false,
})
export class InlineHelpComponent {
  constructor(public info: SkyAgGridHeaderInfo) {}

  public onHelpClick(): void {
    console.log(`Help was clicked for ${this.info.displayName}.`);
  }
}
