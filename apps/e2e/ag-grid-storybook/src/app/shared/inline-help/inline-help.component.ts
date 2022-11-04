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
})
export class InlineHelpComponent {
  readonly #displayName: string;

  constructor({ displayName }: SkyAgGridHeaderInfo) {
    this.#displayName = displayName;
  }

  public onHelpClick(): void {
    alert(`Help was clicked for ${this.#displayName}.`);
  }
}
