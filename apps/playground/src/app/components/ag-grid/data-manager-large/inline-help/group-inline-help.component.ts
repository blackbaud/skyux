import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { SkyAgGridHeaderGroup, SkyAgGridHeaderGroupInfo } from '@skyux/ag-grid';

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
})
export class GroupInlineHelpComponent {
  constructor(
    @Inject(SkyAgGridHeaderGroup) public info: SkyAgGridHeaderGroupInfo
  ) {}

  public onHelpClick(): void {
    console.log(`Help was clicked for ${this.info.displayName}.`);
  }
}
