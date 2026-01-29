import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculatorId,
  SkyDateRangePickerModule,
} from '@skyux/datetime';
import {
  SkyFilterBarFilterValue,
  SkyFilterItemModal,
  SkyFilterItemModalInstance,
} from '@skyux/filter-bar';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-start-date-filter-modal',
  imports: [FormsModule, SkyDateRangePickerModule, SkyModalModule],
  template: `
    <sky-modal [headingText]="filterLabelText">
      <sky-modal-content>
        <sky-date-range-picker
          labelText="Filter by start date"
          [(ngModel)]="dateRange"
        />
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
export class StartDateFilterModalComponent implements SkyFilterItemModal {
  public readonly modalInstance = inject(SkyFilterItemModalInstance);
  readonly #context = this.modalInstance.context;

  public filterLabelText = this.#context.filterLabelText;
  public dateRange: SkyDateRangeCalculation | undefined;

  constructor() {
    const existingValue = this.#context.filterValue?.value as
      | SkyDateRangeCalculation
      | undefined;
    if (existingValue) {
      this.dateRange = existingValue;
    }
  }

  public apply(): void {
    if (
      this.dateRange &&
      this.dateRange.calculatorId !== SkyDateRangeCalculatorId.AnyTime
    ) {
      const filterValue: SkyFilterBarFilterValue = {
        value: this.dateRange,
        displayValue: this.#formatDateRange(this.dateRange),
      };
      this.modalInstance.save({ filterValue });
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

  #formatDateRange(range: SkyDateRangeCalculation): string {
    if (range.startDate && range.endDate) {
      const start = new Date(range.startDate).toLocaleDateString();
      const end = new Date(range.endDate).toLocaleDateString();
      return `${start} - ${end}`;
    } else if (range.startDate) {
      return `After ${new Date(range.startDate).toLocaleDateString()}`;
    } else if (range.endDate) {
      return `Before ${new Date(range.endDate).toLocaleDateString()}`;
    }
    return 'Date range applied';
  }
}
