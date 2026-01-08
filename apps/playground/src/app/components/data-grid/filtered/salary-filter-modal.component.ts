import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAgGridNumberRangeFilterValue } from '@skyux/ag-grid';
import {
  SkyFilterItemModal,
  SkyFilterItemModalInstance,
} from '@skyux/filter-bar';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-salary-filter-modal',
  imports: [FormsModule, SkyInputBoxModule, SkyModalModule],
  template: `
    <sky-modal [headingText]="filterLabelText">
      <sky-modal-content>
        <div class="sky-form-group">
          <sky-input-box labelText="Minimum salary" stacked>
            <input type="number" [(ngModel)]="minSalary" />
          </sky-input-box>
        </div>
        <div class="sky-form-group">
          <sky-input-box labelText="Maximum salary">
            <input type="number" [(ngModel)]="maxSalary" />
          </sky-input-box>
        </div>
      </sky-modal-content>
      <sky-modal-footer>
        <button type="button" class="sky-btn sky-btn-primary" (click)="apply()">
          Apply
        </button>
        <button type="button" class="sky-btn sky-btn-link" (click)="clear()">
          Clear
        </button>
        <button type="button" class="sky-btn sky-btn-link" (click)="cancel()">
          Cancel
        </button>
      </sky-modal-footer>
    </sky-modal>
  `,
})
export class SalaryFilterModalComponent implements SkyFilterItemModal {
  public readonly modalInstance = inject(SkyFilterItemModalInstance);
  readonly #context = this.modalInstance.context;

  public filterLabelText = this.#context.filterLabelText;

  public minSalary: number | undefined;
  public maxSalary: number | undefined;

  constructor() {
    const existingValue = this.#context.filterValue?.value as
      | SkyAgGridNumberRangeFilterValue
      | undefined;
    if (existingValue) {
      this.minSalary = existingValue.from;
      this.maxSalary = existingValue.to;
    }
  }

  public apply(): void {
    if (
      (this.minSalary ?? undefined) !== undefined ||
      (this.maxSalary ?? undefined) !== undefined
    ) {
      const value: SkyAgGridNumberRangeFilterValue = {
        from: this.minSalary ?? null,
        to: this.maxSalary ?? null,
      };
      let displayValue: string;
      if (
        (this.minSalary ?? undefined) !== undefined &&
        (this.maxSalary ?? undefined) !== undefined
      ) {
        displayValue = `$${this.minSalary} - $${this.maxSalary}`;
      } else if ((this.minSalary ?? undefined) !== undefined) {
        displayValue = `From $${this.minSalary}`;
      } else {
        displayValue = `Up to $${this.maxSalary}`;
      }
      this.modalInstance.save({ filterValue: { value, displayValue } });
    } else {
      this.modalInstance.save({ filterValue: undefined });
    }
  }

  public clear(): void {
    this.modalInstance.save({ filterValue: undefined });
  }

  public cancel(): void {
    this.modalInstance.cancel();
  }
}
