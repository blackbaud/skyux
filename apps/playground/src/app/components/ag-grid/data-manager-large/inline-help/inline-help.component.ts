import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { SkyAgGridHeader, SkyAgGridHeaderInfo } from '@skyux/ag-grid';

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
  constructor(@Inject(SkyAgGridHeader) public info: SkyAgGridHeaderInfo) {}

  public onHelpClick(): void {
    console.log(`Help was clicked for ${this.info.displayName}.`);
  }
}
