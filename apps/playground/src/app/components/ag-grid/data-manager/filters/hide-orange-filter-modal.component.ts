import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyFilterBarFilterValue,
  SkyFilterItemModalInstance,
} from '@skyux/filter-bar';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-hide-orange-filter-modal',
  standalone: true,
  imports: [FormsModule, SkyCheckboxModule, SkyModalModule],
  template: `
    <sky-modal headingText="filterLabelText">
      <sky-modal-content>
        <sky-checkbox labelText="Hide orange fruits" [(ngModel)]="hideOrange" />
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
export class HideOrangeFilterModalComponent {
  readonly #instance = inject(SkyFilterItemModalInstance);
  readonly #context = this.#instance.context;

  public filterLabelText = this.#context.filterLabelText;
  public hideOrange = !!this.#context.filterValue?.value;

  public apply(): void {
    const filterValue: SkyFilterBarFilterValue | undefined = this.hideOrange
      ? { value: true, displayValue: 'Hide orange fruits' }
      : undefined;
    this.#instance.save({ filterValue });
  }

  public cancel(): void {
    this.#instance.cancel();
  }
}
