import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyFilterBarFilterValue,
  SkyFilterItemModalInstance,
} from '@skyux/filter-bar';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-name-filter-modal',
  imports: [FormsModule, SkyInputBoxModule, SkyModalModule],
  template: `
    <sky-modal [headingText]="filterLabelText">
      <sky-modal-content>
        <sky-input-box labelText="Filter by name">
          <input type="text" [(ngModel)]="nameFilter" />
        </sky-input-box>
      </sky-modal-content>
      <sky-modal-footer>
        <button type="button" class="sky-btn sky-btn-primary" (click)="apply()">
          Apply
        </button>
        <button type="button" class="sky-btn sky-btn-link" (click)="cancel()">
          Cancel
        </button>
      </sky-modal-footer>
    </sky-modal>
  `,
})
export class NameFilterModalComponent {
  readonly #instance = inject(SkyFilterItemModalInstance);
  readonly #context = this.#instance.context;

  public filterLabelText = this.#context.filterLabelText;
  public nameFilter = (this.#context.filterValue?.value as string) ?? '';

  public apply(): void {
    const filterValue: SkyFilterBarFilterValue | undefined = this.nameFilter
      ? {
          value: this.nameFilter,
          displayValue: `Name contains "${this.nameFilter}"`,
        }
      : undefined;
    this.#instance.save({ filterValue });
  }

  public cancel(): void {
    this.#instance.cancel();
  }
}
