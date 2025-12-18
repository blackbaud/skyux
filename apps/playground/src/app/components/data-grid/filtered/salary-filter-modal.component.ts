import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAgGridNumberRangeFilterValue } from '@skyux/ag-grid';
import {
  SkyFilterBarFilterValue,
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
          <sky-input-box labelText="Minimum salary">
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
export class SalaryFilterModalComponent {
  readonly #instance = inject(SkyFilterItemModalInstance);
  readonly #context = this.#instance.context;

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
    if (this.minSalary !== undefined && this.maxSalary !== undefined) {
      const rangeValue: SkyAgGridNumberRangeFilterValue = {
        from: this.minSalary,
        to: this.maxSalary,
      };
      const filterValue: SkyFilterBarFilterValue = {
        value: rangeValue,
        displayValue: `$${this.minSalary.toLocaleString()} - $${this.maxSalary.toLocaleString()}`,
      };
      this.#instance.save({ filterValue });
    } else {
      this.#instance.save({ filterValue: undefined });
    }
  }

  public clear(): void {
    this.#instance.save({ filterValue: undefined });
  }

  public cancel(): void {
    this.#instance.cancel();
  }
}
