import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyAgGridHeaderInfo } from '@skyux/ag-grid';
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
  protected displayName: string | undefined;

  readonly #headerInfo = inject(SkyAgGridHeaderInfo);

  constructor() {
    this.displayName = this.#headerInfo.displayName;
  }

  protected onHelpClick(): void {
    alert(`Help was clicked for ${this.displayName}.`);
  }
}
