import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyAgGridHeaderGroupInfo } from '@skyux/ag-grid';
import { SkyHelpInlineModule } from '@skyux/help-inline';

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
  imports: [SkyHelpInlineModule],
})
export class GroupInlineHelpComponent {
  public readonly info = inject(SkyAgGridHeaderGroupInfo);

  public onHelpClick(): void {
    console.log(`Help was clicked for ${this.info.displayName}.`);
  }
}
