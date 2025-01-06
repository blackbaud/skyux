import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyAgGridHeaderGroupInfo } from '@skyux/ag-grid';

@Component({
  selector: 'app-group-inline-help',
  templateUrl: './group-inline-help.component.html',
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
export class GroupInlineHelpComponent {
  constructor(public info: SkyAgGridHeaderGroupInfo) {}

  public onHelpClick(): void {
    console.log(`Help was clicked for ${this.info.displayName}.`);
  }
}
