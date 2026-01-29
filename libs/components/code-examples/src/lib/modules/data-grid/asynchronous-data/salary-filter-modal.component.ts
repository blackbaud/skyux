import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  SkyAutonumericModule,
  SkyAutonumericOptions,
} from '@skyux/autonumeric';
import { SkyNumericService } from '@skyux/core';
import {
  SkyDataGridNumberRangeFilterFormGroup,
  SkyDataGridNumberRangeFilterValue,
} from '@skyux/data-grid';
import {
  SkyFilterItemModal,
  SkyFilterItemModalInstance,
} from '@skyux/filter-bar';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalError, SkyModalModule } from '@skyux/modals';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-salary-filter-modal',
  imports: [
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyAutonumericModule,
  ],
  template: `
    <form [formGroup]="form">
      <sky-modal [headingText]="filterLabelText" [formErrors]="formErrors()">
        <sky-modal-content>
          <div class="sky-form-group">
            <sky-input-box labelText="Minimum salary" stacked>
              <input
                type="text"
                formControlName="from"
                [skyAutonumeric]="autonumericOptions"
              />
            </sky-input-box>
          </div>
          <div class="sky-form-group">
            <sky-input-box labelText="Maximum salary">
              <input
                type="text"
                formControlName="to"
                [skyAutonumeric]="autonumericOptions"
              />
            </sky-input-box>
          </div>
        </sky-modal-content>
        <sky-modal-footer>
          <button
            type="button"
            class="sky-btn sky-btn-primary"
            (click)="apply()"
          >
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
    </form>
  `,
})
export class SalaryFilterModalComponent implements SkyFilterItemModal {
  public readonly modalInstance = inject(SkyFilterItemModalInstance);
  readonly #context = this.modalInstance.context;
  readonly #fb = inject(FormBuilder);
  readonly #existingValue = this.#context.filterValue?.value as
    | SkyDataGridNumberRangeFilterValue
    | undefined;
  readonly #numeric = inject(SkyNumericService);

  public filterLabelText = this.#context.filterLabelText;

  protected readonly form = this.#fb.group(
    {
      from: this.#fb.control<number | null>(this.#existingValue?.from ?? null),
      to: this.#fb.control<number | null>(this.#existingValue?.to ?? null),
    },
    {
      validators: (formGroup: SkyDataGridNumberRangeFilterFormGroup) => {
        const min = formGroup.controls.from.value;
        const max = formGroup.controls.to.value;
        // At least one value must be provided.
        if (min === null && max === null) {
          return {
            salaryRangeRequired: { message: 'Salary Range required' },
          };
        }
        // If both values are provided, min must be less than or equal to max.
        if (min !== null && max !== null && min >= max) {
          return { salaryRangeInvalid: { message: 'Salary Range Invalid' } };
        }
        return null;
      },
      updateOn: 'change',
    },
  ) as SkyDataGridNumberRangeFilterFormGroup;

  protected readonly formErrors = toSignal(
    this.form.statusChanges.pipe(
      map(() => Object.values(this.form.errors ?? {}) as SkyModalError[]),
    ),
  );
  protected autonumericOptions: SkyAutonumericOptions = 'dollarPos' as const;

  public apply(): void {
    if (this.form.valid) {
      const value = {
        from: this.form.controls.from.value,
        to: this.form.controls.to.value,
      } as SkyDataGridNumberRangeFilterValue;
      let displayValue = '';
      if (value.from && value.to) {
        displayValue = `${this.#format(value.from)} - ${this.#format(value.to)}`;
      } else if (value.from) {
        displayValue = `From ${this.#format(value.from)}`;
      } else if (value.to) {
        displayValue = `Up to ${this.#format(value.to)}`;
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

  #format(value: number): string {
    return this.#numeric.formatNumber(value, { format: 'currency' });
  }
}
