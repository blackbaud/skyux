import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  readonly #displayName = inject(SkyAgGridHeaderInfo).displayName;

  public onHelpClick(): void {
    alert(`Help was clicked for ${this.#displayName}.`);
  }
}
