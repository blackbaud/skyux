import { Signal } from '@angular/core';

import type { Observable } from 'rxjs';

export interface SkyAgGridValidatorProperties<
  TValue = unknown,
  TData = unknown,
> {
  /**
   * An optional function that returns an observable that emits a string. Can be used with resources to localize the
   * value displayed in the cell.
   */
  valueResourceObservable?: (
    value: TValue,
    data?: TData,
    rowIndex?: number | null,
  ) => Observable<string>;
  /**
   * A function that returns true if the value is valid, or false if it is not. Invalid values
   * will be highlighted and display a validation message.
   */
  validator?: (
    value: TValue,
    data?: TData,
    rowIndex?: number | null,
  ) => boolean;
  /**
   * A string signal function, a string, or a function that returns a string. The message to display when the value is
   * invalid.
   */
  validatorMessage?:
    | Signal<string>
    | string
    | ((value: TValue, data?: TData, rowIndex?: number | null) => string);
}
