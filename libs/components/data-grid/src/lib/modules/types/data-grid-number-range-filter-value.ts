import { FormControl, FormGroup } from '@angular/forms';

/**
 * Filter value for number range filters.
 */
export type SkyDataGridNumberRangeFilterValue =
  | {
      /**
       * The minimum value of the range.
       */
      from: number;
      /**
       * The maximum value of the range.
       */
      to: number;
    }
  | {
      /**
       * The minimum value of the range. Null indicates no minimum.
       */
      from: null | undefined;
      /**
       * The maximum value of the range.
       */
      to: number;
    }
  | {
      /**
       * The minimum value of the range.
       */
      from: number;
      /**
       * The maximum value of the range. Null indicates no maximum.
       */
      to: null | undefined;
    };

export type SkyDataGridNumberRangeFilterFormGroup = FormGroup<{
  from: FormControl<number | null>;
  to: FormControl<number | null>;
}>;
