import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyFilterBarFilterValue,
  SkyFilterItemModal,
  SkyFilterItemModalInstance,
} from '@skyux/filter-bar';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-hide-inactive-filter-modal',
  imports: [FormsModule, SkyCheckboxModule, SkyModalModule],
  template: `
    <sky-modal [headingText]="filterLabelText">
      <sky-modal-content>
        <sky-checkbox
          labelText="Hide inactive employees"
          [(ngModel)]="hideInactive"
        />
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
export class HideInactiveFilterModalComponent implements SkyFilterItemModal {
  public readonly modalInstance = inject(SkyFilterItemModalInstance);
  readonly #context = this.modalInstance.context;

  public filterLabelText = this.#context.filterLabelText;
  public hideInactive = !!this.#context.filterValue?.value;

  public apply(): void {
    const filterValue: SkyFilterBarFilterValue | undefined = this.hideInactive
      ? { value: true, displayValue: 'Showing active only' }
      : undefined;
    this.modalInstance.save({ filterValue });
  }

  public cancel(): void {
    this.modalInstance.cancel();
  }
}
