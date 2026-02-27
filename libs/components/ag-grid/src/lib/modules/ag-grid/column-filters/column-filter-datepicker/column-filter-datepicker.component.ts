import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

import { IDateAngularComp } from 'ag-grid-angular';
import { IDateParams } from 'ag-grid-community';

@Component({
  selector: 'sky-ag-grid-date-picker',
  imports: [SkyDatepickerModule, ReactiveFormsModule, SkyInputBoxModule],
  templateUrl: './column-filter-datepicker.component.html',
  styleUrls: [
    '../../cell-editors/cell-editor-datepicker/cell-editor-datepicker.component.scss',
    './column-filter-datepicker.component.scss',
  ],
})
export class SkyAgGridColumnFilterDatepickerComponent implements IDateAngularComp {
  protected readonly formGroup = inject(FormBuilder).group({
    date: new FormControl<string | null>(null),
  });
  protected readonly params = signal<IDateParams | undefined>(undefined);
  protected readonly isHeaderFiler = computed(
    () => this.params()?.location === 'filter',
  );
  protected readonly maxDate = computed(() => {
    const maxValidDate = this.params()?.filterParams?.maxValidDate;
    if (maxValidDate && maxValidDate instanceof Date) {
      return maxValidDate;
    }
    if (maxValidDate) {
      return new Date(maxValidDate);
    }
    return undefined;
  });
  protected readonly minDate = computed(() => {
    const minValidDate = this.params()?.filterParams.minValidDate;
    if (minValidDate && minValidDate instanceof Date) {
      return minValidDate;
    }
    if (minValidDate) {
      return new Date(minValidDate);
    }
    return undefined;
  });
  readonly #formValue = toSignal(this.formGroup.controls.date.valueChanges, {
    initialValue: null,
  });
  readonly #dateValue = computed(() => {
    const value = this.#formValue();
    return value ? new Date(value) : null;
  });

  constructor() {
    this.formGroup.controls.date.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        const params = this.params();
        params?.onDateChanged?.();
      });
  }

  public agInit(params: IDateParams): void {
    this.params.set(params);
  }

  public getDate(): Date | null {
    return this.#dateValue();
  }

  public refresh(params: IDateParams): void {
    this.agInit(params);
  }

  public setDate(date: Date | null): void {
    this.formGroup.controls.date.setValue(date?.toISOString() ?? null);
  }

  public setDisabled(disabled: boolean): void {
    if (disabled) {
      this.formGroup.controls.date.disable();
    } else {
      this.formGroup.controls.date.enable();
    }
  }

  protected focused(): void {
    this.params()?.onFocusIn?.();
  }

  protected openChange($event: boolean): void {
    if ($event) {
      this.focused();
    }
  }
}
