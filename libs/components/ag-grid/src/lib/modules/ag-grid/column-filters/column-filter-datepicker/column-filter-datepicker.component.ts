import {
  Component,
  computed,
  effect,
  linkedSignal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  host: {
    '[class.sky-ag-grid-cell-editor-datepicker]': 'isHeaderFilter()',
    '(focusin)': 'focused()',
  },
})
export class SkyAgGridColumnFilterDatepickerComponent implements IDateAngularComp {
  protected readonly dateControl = new FormControl<string | null>(null);
  protected readonly params = signal<IDateParams | undefined>(undefined);
  protected readonly isHeaderFilter = computed(
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
    const minValidDate = this.params()?.filterParams?.minValidDate;
    if (minValidDate && minValidDate instanceof Date) {
      return minValidDate;
    }
    if (minValidDate) {
      return new Date(minValidDate);
    }
    return undefined;
  });
  readonly #formValue = toSignal(this.dateControl.valueChanges, {
    initialValue: null,
  });
  readonly #dateValue = linkedSignal(
    () => {
      const value = this.#formValue();
      return value ? new Date(value) : null;
    },
    {
      equal: (a, b) => {
        if (!!a !== !!b) {
          return false;
        }
        return a?.getTime() === b?.getTime();
      },
    },
  );
  readonly #dateValueString = computed(
    () => this.#dateValue()?.toISOString() ?? '',
  );
  readonly #hadValue = linkedSignal({
    source: () => !!this.#formValue(),
    computation: (_hasValue, previous) =>
      !!previous?.source || !!previous?.value,
  });

  constructor() {
    effect(() => {
      const hasValue = this.#hadValue();
      const params = this.params();
      const onDateChanged = params?.onDateChanged;
      if (onDateChanged && hasValue) {
        onDateChanged();
      }
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
    const currentDate = this.#dateValueString();
    const newDate = date?.toISOString() ?? '';
    if (newDate !== currentDate) {
      this.dateControl.setValue(newDate || null);
    }
  }

  public setDisabled(disabled: boolean): void {
    if (disabled) {
      this.dateControl.disable();
    } else {
      this.dateControl.enable();
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

  protected dateChange(): void {
    this.params()?.onDateChanged?.();
  }
}
